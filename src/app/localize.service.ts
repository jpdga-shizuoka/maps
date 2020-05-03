import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

import LOCATION_TITLE from '../assets/models/ja/location-title.json';
import PREFECTURE from '../assets/models/ja/prefecture.json';
import EVENT_TITLE from '../assets/models/ja/event-title.json';
import EVENT_TERMS from '../assets/models/ja/event-terms.json';

export type Language = 'global' | 'local';
export const GLOBAL = 'global' as Language;
export const LOCAL = 'local' as Language;

const REMOVE_PATERN = /[ \-\.\,]/g;
const DICTIONARIES = [
  LOCATION_TITLE,
  PREFECTURE,
  EVENT_TERMS,
];
const DEFAULT_LOCAL_LANGUAGE = 'ja';
const DISTANSE_FROM_MARKER_TO_GOAL = {
  global: (distanse: string, marker: string) => `${distanse} to goal from the ${marker.toLowerCase()}`,
  ja: (distanse: string, marker: string) => `${marker}からゴールまで${distanse}`,
};

interface EventParts {
  count: number;
  key: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocalizeService {

  language = LOCAL;

  get localLanguage() {
    return this.language === GLOBAL
    ? GLOBAL
    : (environment['localLanguage'] || DEFAULT_LOCAL_LANGUAGE);
  }

  get isGlobal() {
    return this.language === GLOBAL;
  }

  transform(value?: string): string {
    if(!value || this.isGlobal) {
      return value;
    }
    let result = value;
    for (const dict of DICTIONARIES) {
      const local = dict[name2key(value)];
      if (local) {
        result = local;
        break
      }
    }
    if (value === result) {
      return event2local(value);
    } else {
      return result;
    }
  }

  distanseFromMarkerToGoal(distanse: string, marker: string) {
    return DISTANSE_FROM_MARKER_TO_GOAL[this.localLanguage](distanse, marker);
  }
}

function event2local(eventName: string): string {
  const parts = event2key(eventName);
  if (!parts) {
    const title = EVENT_TITLE[name2key(eventName)];
    return title ? title : eventName;
  }
  const aliase = EVENT_TITLE[parts.key];
  if (!aliase) {
    return eventName;
  }
  if (parts.count == null) {
    return aliase;
  }
  if (parts.count > 1960) {
    return `${parts.count}年 ${aliase}`;
  }
  return `第${parts.count}回 ${aliase}`;
}

function name2key(name: string): string {
  return name.trim().toLowerCase().replace(REMOVE_PATERN, '');
}

function event2key(name?: string): EventParts | undefined {
  if (!name) {
    return undefined;
  }
  const n = name.trim().toLowerCase();
  const eventName = /the (\d+)(st|nd|rd|th|) (.+)/;
  const altEventName = /the (.+)/;

  let results = n.match(eventName);
  if (results == null) {
    results = n.match(altEventName);
    if (results == null) {
      return undefined;
    }
    if (results.length !== 2) {
      return undefined;
    }
    return {
      count: undefined,
      key: results[1].replace(REMOVE_PATERN, '')
    };
  } else if (results.length !== 4) {
    return undefined;
  }
  return {
    count: parseInt(results[1], 10),
    key: results[3].replace(REMOVE_PATERN, '')
  };
}
