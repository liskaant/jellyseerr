import Media from '@server/entity/Media';
import { User } from '@server/entity/User';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Episode } from './Episode';
import Season from './Season';

@Entity()
export class WatchHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.watchHistory, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public user: User;

  @ManyToOne(() => Media, (media: Media) => media.watchHistory, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public media?: Media;

  @ManyToOne(() => Season, (season: Season) => season.watchHistory, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public season?: Season;

  @ManyToOne(() => Episode, (episode: Episode) => episode.watchHistory, {
    eager: true,
    onDelete: 'CASCADE',
  })
  public episode?: Episode;

  @Column()
  public source: 'manual' | 'calculated' | 'jellyfin';

  @Column('decimal', { precision: 3 })
  public watchProgress: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  constructor(init?: Partial<WatchHistory>) {
    Object.assign(this, init);
  }
}

export class WatchHistoryList {
  public history: WatchHistory[];

  constructor(history?: WatchHistory[]) {
    this.history = history ?? [];
  }

  public async fetch(
    userId?: number,
    ...media: (Media | Season)[]
  ): Promise<WatchHistoryList> {
    for (const item of media)
      this.history.push(...(await item.recWatchHistoryOf(userId)).history);
    return this;
  }

  public findEpisode(
    tmdbId: number,
    season: number,
    episode: number
  ): WatchHistory | undefined {
    return this.history.find((history) => {
      return (
        history.episode?.showTmdbId === tmdbId &&
        history.episode?.seasonNumber === season &&
        history.episode?.episodeNumberStart === episode
      );
    });
  }

  public findSeason(tmdbId: number, season: number): WatchHistory | undefined {
    return this.history.find((history) => {
      return (
        history.season?.showTmdbId === tmdbId &&
        history.season?.seasonNumber === season
      );
    });
  }

  public findMedia(tmdbId: number): WatchHistory | undefined {
    return this.history.find((history) => {
      return history.media?.tmdbId === tmdbId;
    });
  }
}
