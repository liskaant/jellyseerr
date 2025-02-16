import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Season from './Season';
import { WatchHistory } from './WatchHistory';

@Entity()
@Index(['showTmdbId', 'seasonNumber', 'episodeNumberStart', 'episodeNumberEnd'])
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  public showTmdbId?: number;

  @ManyToOne(() => Season, (season: Season) => season.episodes, {
    onDelete: 'CASCADE',
  })
  public season: Season;

  @Column()
  public seasonNumber: number;

  @Column()
  public episodeNumberStart: number;

  @Column()
  public episodeNumberEnd: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @OneToMany(() => WatchHistory, (history: WatchHistory) => history.episode)
  public watchHistory: Promise<WatchHistory[]>;

  constructor(init?: Partial<Episode>) {
    Object.assign(this, init);
  }

  public async watchHistoryOf(
    userId: number
  ): Promise<WatchHistory | undefined> {
    const history = await this.watchHistory;
    return history.find((h) => h.user.id === userId);
  }
}
