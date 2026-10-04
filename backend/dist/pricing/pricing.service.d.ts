import { PrismaService } from '../prisma/prisma.service';
export declare class PricingService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllTiers(): Promise<({
        dishPrices: {
            id: string;
            dishId: string;
            tierId: string;
            price: number;
        }[];
        optionPrices: {
            id: string;
            tierId: string;
            price: number;
            optionId: string;
        }[];
    } & {
        id: string;
        name: string;
        isDefault: boolean;
        derivedFrom: string | null;
    })[]>;
    createTier(data: {
        name: string;
        isDefault?: boolean;
        derivedFrom?: string;
    }): Promise<{
        id: string;
        name: string;
        isDefault: boolean;
        derivedFrom: string | null;
    }>;
    setDishPrice(dishId: string, tierId: string, price: number): Promise<{
        id: string;
        dishId: string;
        tierId: string;
        price: number;
    }>;
    resolvePrice(dishId: string, tierId?: string): Promise<number>;
}
