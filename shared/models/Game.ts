import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export default class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner_id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  version: string;
}
