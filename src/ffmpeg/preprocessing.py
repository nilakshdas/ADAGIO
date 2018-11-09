import os
from subprocess import call, PIPE


IN_DIR = '/data/uploaded'
OUT_DIR = '/data/preprocessed'


def amr_encode(filename):
    assert filename.endswith('.wav')
    input_file = os.path.join(IN_DIR, filename)
    output_file = os.path.join(OUT_DIR, filename)
    temp_amr_file = output_file.replace('.wav', '.amr')
    assert os.path.exists(input_file), \
        "%s does not exist" % input_file

    encode_cmd = 'ffmpeg -y -i %s -ar 8000 -ab 12.2k %s' \
        % (input_file, temp_amr_file)
    decode_cmd = 'ffmpeg -y -i %s -ar 16000 %s' \
        % (temp_amr_file, output_file)

    call(encode_cmd, shell=True, stdout=PIPE)
    call(decode_cmd, shell=True, stdout=PIPE)

    os.remove(temp_amr_file)

    return os.path.basename(output_file)


def mp3_compress(filename):
    assert filename.endswith('.wav')
    input_file = os.path.join(IN_DIR, filename)
    output_file = os.path.join(OUT_DIR, filename)
    temp_mp3_file = output_file.replace('.wav', '.mp3')
    assert os.path.exists(input_file), \
        "%s does not exist" % input_file

    encode_cmd = 'ffmpeg -y -i %s -acodec libmp3lame %s' \
        % (input_file, temp_mp3_file)
    decode_cmd = 'ffmpeg -y -i %s -ar 16000 %s' \
        % (temp_mp3_file, output_file)

    call(encode_cmd, shell=True, stdout=PIPE)
    call(decode_cmd, shell=True, stdout=PIPE)

    os.remove(temp_mp3_file)

    return os.path.basename(output_file)
