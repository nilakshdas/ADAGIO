import CONFIG from './config';

let _instance = null;

class Backend {
    constructor() {
        if (_instance !== null)
            return _instance;
        _instance = this;

        this.eventBus = document.createElement('eventbus');

        this.uploadBlob = this.uploadBlob.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.fetchAudioBlob = this.fetchAudioBlob.bind(this);
        this.startAttackJob = this.startAttackJob.bind(this);
        this.getTranscription = this.getTranscription.bind(this);
        this.getAttackJobStatus = this.getAttackJobStatus.bind(this);
        this.getPreprocessedBlobWithTranscription = this.getPreprocessedBlobWithTranscription.bind(this);

        this._socket = new WebSocket(CONFIG.WEBSOCKET_URL);
        this._socket.onopen = e => console.log('websocket connected', e);
        this._socket.onerror = e => console.log('error connecting to websocket', e);
        this._socket.onclose = e => console.log('websocket closed', e);
        this._socket.onmessage = e => {
            var reader = new FileReader();
            reader.onload = e1 => {
                const message = JSON.parse(e1.target.result);
                this.eventBus.dispatchEvent(
                    new CustomEvent(message.subject, {detail: message})
                );
            };
            reader.readAsText(e.data);

            // const message = JSON.parse(e.data);
            // this.eventBus.dispatchEvent(
            //     new CustomEvent(message.subject, {detail: message})
            // );
        }
    }

    uploadBlob(blob, blobID) {
        const reader = new FileReader();
        const promise = new Promise((resolve, reject) => {
            reader.onload = e => {
                const blobData = e.target.result;
                const requestData = {
                    id: blobID,
                    blobData: blobData
                };

                try {
                    fetch(
                        CONFIG.FILESERVER_URL, {
                            method: 'POST',
                            body: JSON.stringify(requestData)
                        }
                    ).then(resolve);
                } catch (e) { reject(e); }
            }
        });

        reader.readAsDataURL(blob);
        return promise;
    }

    fetchAudioBlob(blobID) {
        const promise = new Promise((resolve, reject) => {
            fetch(CONFIG.FILESERVER_URL+`/${blobID}.wav`, {
                method: 'GET',
                headers: {
                    'Accept': 'audio/x-wav',
                    'Content-Type': 'audio/x-wav'
                }
            }).then(response => {
                return response.blob();
            }).then(blob => {
                let randomID = Math.floor(Math.random() * 999999);
                let audioBlob = new File(
                    [blob], `${blobID}-${randomID}.wav`, {
                        type:'audio/x-wav',
                        lastModified:new Date().getTime()
                    }
                );

                resolve(audioBlob);
            });
        });

        return promise;
    }

    sendMessage(message) { this._socket.send(JSON.stringify(message)); }

    getTranscription(audioBlob, blobID) {
        const promise = new Promise((resolve, reject) => {
            this.uploadBlob(audioBlob, blobID)
                .then(response => {
                    const onTranscribed = e => {
                        const incomingMessage = e.detail;
                        if (incomingMessage.payload.id === blobID) {
                            this.eventBus.removeEventListener('transcribed', onTranscribed);
                            resolve(incomingMessage.payload.transcription);
                        }
                    };

                    this.sendMessage({
                        subject: 'transcribe',
                        payload: {id: blobID}
                    });

                    this.eventBus.addEventListener('transcribed', onTranscribed);
                });
        });

        return promise;
    }

    getPreprocessedBlobWithTranscription(audioBlob, blobID, preprocessingOption) {
        const promise = new Promise((resolve, reject) => {
            this.uploadBlob(audioBlob, blobID)
                .then(response => {
                    const onPreprocessedAndTranscribed = e => {
                        const incomingMessage = e.detail;
                        if (incomingMessage.payload.id === blobID) {
                            this.eventBus.removeEventListener(
                                'preprocessed-and-transcribed',
                                onPreprocessedAndTranscribed
                            );

                            let transcription = incomingMessage.payload.transcription;

                            this.fetchAudioBlob(blobID).then(audioBlob => {
                                resolve([audioBlob, transcription]);
                            });
                        }
                    };

                    this.sendMessage({
                        subject: 'preprocess-and-transcribe',
                        payload: {
                            id: blobID,
                            preprocessingOption: preprocessingOption
                        }
                    });

                    this.eventBus.addEventListener(
                        'preprocessed-and-transcribed',
                        onPreprocessedAndTranscribed
                    );
                });
        });

        return promise;
    }

    startAttackJob(audioBlob, blobID, targetTranscription) {
        const promise = new Promise((resolve, reject) => {
            this.uploadBlob(audioBlob, blobID)
                .then(response => {
                    const onPerturbing = e => {
                        const incomingMessage = e.detail;
                        if (incomingMessage.payload.id === blobID) {
                            this.eventBus.removeEventListener(
                                'perturbing',
                                onPerturbing
                            );

                            resolve(incomingMessage.payload.jobID);
                        }
                    }

                    this.sendMessage({
                        subject: 'perturb',
                        payload: {
                            id: blobID,
                            targetTranscription: targetTranscription
                        }
                    });

                    this.eventBus.addEventListener(
                        'perturbing',
                        onPerturbing
                    );
                });
        });

        return promise;
    }

    getAttackJobStatus(blobID, jobID) {
        const promise = new Promise((resolve, reject) => {
            const onPerturbationStatus = e => {
                const incomingMessage = e.detail;
                if (incomingMessage.payload.id === blobID) {
                    this.eventBus.removeEventListener(
                        'perturbation-status',
                        onPerturbationStatus
                    );

                    if (incomingMessage.payload.jobID !== null)
                        resolve(incomingMessage.payload.status);
                    else
                        resolve(null);
                }
            }

            this.sendMessage({
                subject: 'fetch-status',
                payload: {
                    id: blobID,
                    jobID: jobID
                }
            });

            this.eventBus.addEventListener(
                'perturbation-status',
                onPerturbationStatus
            );
        });

        return promise;
    }
}

export default new Backend();
