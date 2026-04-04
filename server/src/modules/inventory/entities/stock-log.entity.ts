import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { StockLogType } from '../constants/stock.enum';

@Entity('stock_logs')
export class StockLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    ingredientId: string;

    @ManyToOne(() => Ingredient, { onDelete: 'SET NULL' })
    ingredient: Ingredient;

    @Column()
    ingredientName: string;

    @Column('decimal', { precision: 10, scale: 2 })
    prevQty: number;

    @Column('decimal', { precision: 10, scale: 2 })
    newQty: number;

    @Column('decimal', { precision: 10, scale: 2 })
    delta: number;

    @Column({ type: 'enum', enum: StockLogType })
    type: StockLogType;

    @Column({ nullable: true })
    note: string;

    @CreateDateColumn()
    createAt: Date;
}
