//import path from 'path';
import * as constants from './constants';

export function frameFrom(fullPath: string): string
{
    const pattern = '_(?<frame>\\d+)'+constants.POSTFIX+'(\\.jpg|\\.txt)$'
    // console.log(pattern);
    const matches = fullPath.match(pattern);
    //console.log(matches);
    const frame = matches?.groups?.frame ?? 'regex failed to match frame on: ' + fullPath;
    return frame;
}