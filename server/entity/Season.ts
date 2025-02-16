import { MediaStatus } from '@server/constants/media';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Episode } from './Episode';
import Media from './Media';
import { WatchHistory, WatchHistoryList } from './WatchHistory';

@Entity()
class Season {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: true })
  public showTmdbId?: number;

  @Column()
  public seasonNumber: number;

  @Column({ type: 'int', default: MediaStatus.UNKNOWN })
  public status: MediaStatus;

  @Column({ type: 'int', default: MediaStatus.UNKNOWN })
  public status4k: MediaStatus;

  @ManyToOne(() => Media, (media) => media.seasons, {
    onDelete: 'CASCADE',
  })
  public media: Promise<Media>;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => Episode, (episode: Episode) => episode.season, {
    cascade: true,
  })
  public episodes: Promise<Episode[]>;

  @OneToMany(() => WatchHistory, (history: WatchHistory) => history.season)
  public watchHistory: Promise<WatchHistory[]>;

  constructor(init?: Partial<Season>) {
    Object.assign(this, init);
  }

  public async episode(
    start?: number,
    end?: number
  ): Promise<Episode | undefined> {
    return (await this.episodes).find(
      (e) =>
        e.episodeNumberStart === start && e.episodeNumberEnd === (end ?? start)
    );
  }

  public async watchHistoryOf(
    userId?: number
  ): Promise<WatchHistory | undefined> {
    if (!userId) return undefined;
    const history = await this.watchHistory;
    return history.find((h) => h.user.id === userId);
  }

  public async recWatchHistoryOf(userId?: number): Promise<WatchHistoryList> {
    const watchHistory = new WatchHistoryList();
    if (!userId) return watchHistory;

    const history = await this.watchHistoryOf(userId);
    if (history) watchHistory.history.push(history);

    for (const episode of await this.episodes) {
      const history = await episode.watchHistoryOf(userId);
      if (history) watchHistory.history.push(history);
    }

    return watchHistory;
  }
}

export default Season;
