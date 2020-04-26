import requests
import urllib
import os
import sys
import numpy as np
import codecs
import pandas as pd
from numpy import NaN
import subprocess
import json

ffmpeg_path = '/Users/chenzhen/Downloads/ffmpeg-4.0.2-macos64-static/bin/ffmpeg';
filename = 'meta.txt';


def get_url_list(host, lines):
    ts_url_list = []
    for line in lines:
        line = line.strip();
        if not line.startswith('#') and line != '':
            if line.startswith('http'):
                ts_url_list.append(line)
            else:
                ts_url_list.append('%s/%s' % (host, line))
    return ts_url_list

def get_host(url):
    (fp,tfn) = os.path.split(url);
    f = fp + "/"
    return f

def download_ts_file(ts_url_list, dir):
    i = 0;
    for ts_url in reversed(ts_url_list):
        i += 1;
        file_name = ts_url[ts_url.rfind('/'):];
        curr_path = '%s%s' % (dir, file_name);
        print('\n[process]: %s/%s' % (i, len(ts_url_list)));
        if os.path.isfile(curr_path):
            print('[warn]: file already exist');
            continue;
        else:
            print('[download]:', ts_url);
            print('[target]:', curr_path);
            urllib.request.urlretrieve(ts_url, curr_path);

def download_file(url,dir):
    file_name = url[url.rfind('/'):];
    new_name = '%s%s' % (dir, file_name);
    print('[downing]'+url);
    if url == 'https://alicache.gensee.com/gsgetrecord/record42.gensee.net/gsrecord/16042/sbr/2020_03_15/t7WJ0TG4US_1584250579/hls/1837121082_0.png':
        return;
    if os.path.isfile(new_name):
        print('[warn]:'+new_name+' file already exist');
    else:
        try:
            urllib.request.urlretrieve(url, new_name);
        except urllib.error.HTTPError as e:
            print('[HTTPError] {}'.format(e.code))

def print_and_exit(message):
    print(message);
    #exit();

def gen_mp4(dir,m3u8,filename):
    name = dir+'/'+filename;
    if os.path.isfile(name):
        print('[mp4]'+name+' is exist!');
        return;
    print('[m3u8]'+m3u8+' to [mp4]' + name);
    ffmpeg_process = subprocess.Popen([ffmpeg_path, '-i', m3u8, '-c', 'copy', name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print('\n\nffmpeg is working, please wait...\n')
    ffmpeg_stdout, ffmpeg_stderr = ffmpeg_process.communicate()
    ffmpeg_result = ffmpeg_process.returncode

    # do some cleaning
    if ffmpeg_result != 0:
        if os.path.exists(name):
            os.remove(name)
        if os.path.exists(name):
            os.remove(name)
        print('An error occurred during running ffmpeg.')
        print_and_exit((ffmpeg_stdout, ffmpeg_stderr))
    else:
        print_and_exit('Done. Output file is %s.' % name)

def process_page(fp,pages,swf):
    if isinstance(pages,list):
        for d in pages:
            if swf==0:
                png = fp+'/'+d['hls'];
            else:
                png = fp+'/'+d['content'];
            download_file(png,dir);
    else:
        if swf==0:
            png = fp+'/'+pages['hls'];
        else:
            png = fp+'/'+pages['content'];
        download_file(png,dir);

def process_document(fp,documents,swf):
    if isinstance(documents,list):
        for p in documents:
            process_page(fp,p['page'],swf);
    else:
        process_page(fp,documents['page'],swf);

def load_json_png(fp,dir,jspng):
    pngs = jspng[jspng.rfind('/'):];
    json_file = dir+'/'+pngs;
    f = open(json_file,encoding='utf-8')
    print('[json file] '+ json_file);
    content = f.read()
    data = json.loads(content)

    d = data['conf']['module'];
    for module in d:
        if module['name'] == 'document':
            process_document(fp,module['document'],0);

def load_json_swf(fp,dir,jspng):
    pngs = jspng[jspng.rfind('/'):];
    json_file = dir+'/'+pngs;
    f = open(json_file,encoding='utf-8')
    print('[json file] '+ json_file);
    content = f.read()
    data = json.loads(content)

    d = data['conf']['module'];
    for module in d:
        if module['name'] == 'document':
            process_document(fp,module['document'],1);


data = pd.read_csv(filename);
for index,row in data.iterrows():
    (fp,tfn) = os.path.split(row['url']);
    m3u8 = fp+'/hls/record.m3u8';
    anno = fp+'/anno.js';
    jschat = fp+'/chat.js';
    jspng = row['url']+'.js';
    dir = row['date'];
    
    if(dir == 'w4/0328/2'):
        continue;

    download_file(m3u8,dir);
    download_file(anno,dir);
    download_file(jschat,dir);
    download_file(jspng,dir);
    
    host = get_host(m3u8);
    ts_url_list = get_url_list(host, open(dir+'/record.m3u8').readlines());
    print('total file count:', len(ts_url_list));
    download_ts_file(ts_url_list, dir);

    #gen_mp4(dir,dir+'/record.m3u8','record.mp4');
    #load_json_png(fp,dir,jspng);
    #load_json_swf(fp,dir,jspng);
