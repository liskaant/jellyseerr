import type Media from '@server/entity/Media';
import type { User } from '@server/entity/User';
import type { PaginatedResponse } from './common';

export interface MediaResult extends Media {
  watchProgress?: number;
}

export interface MediaResultsResponse extends PaginatedResponse {
  results: MediaResult[];
}

export interface MediaWatchDataResponse {
  data?: {
    users: User[];
    playCount: number;
    playCount7Days: number;
    playCount30Days: number;
  };
  data4k?: {
    users: User[];
    playCount: number;
    playCount7Days: number;
    playCount30Days: number;
  };
}
