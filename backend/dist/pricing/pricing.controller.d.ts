import { PricingService } from './pricing.service';
export declare class PricingController {
    private pricingService;
    constructor(pricingService: PricingService);
    getTiers(): Promise<({
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
    createTier(body: any): Promise<{
        id: string;
        name: string;
        isDefault: boolean;
        derivedFrom: string | null;
    }>;
    setDishPrice(dishId: string, body: {
        tierId: string;
        price: number;
    }): Promise<{
        id: string;
        dishId: string;
        tierId: string;
        price: number;
    }>;
}
