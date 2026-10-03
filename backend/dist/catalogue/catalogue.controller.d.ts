import { CatalogueService } from './catalogue.service';
export declare class CatalogueController {
    private catalogueService;
    constructor(catalogueService: CatalogueService);
    getCategories(): Promise<{
        order: number;
        id: string;
        name: string;
        isActive: boolean;
        isSecret: boolean;
    }[]>;
    createCategory(body: any): Promise<{
        order: number;
        id: string;
        name: string;
        isActive: boolean;
        isSecret: boolean;
    }>;
    getDishes(isActive?: string): Promise<({
        category: {
            order: number;
            id: string;
            name: string;
            isActive: boolean;
            isSecret: boolean;
        };
        optionGroups: ({
            options: {
                id: string;
                name: string;
                allergens: string[];
                dietaryTags: string[];
                displayOrder: number;
                cost: number;
                portions: import("@prisma/client/runtime/library").JsonValue | null;
                groupId: string;
            }[];
        } & {
            id: string;
            name: string;
            isRequired: boolean;
            displayOrder: number;
            usesPortions: boolean;
            dishId: string;
        })[];
        prices: ({
            tier: {
                id: string;
                name: string;
                isDefault: boolean;
                derivedFrom: string | null;
            };
        } & {
            id: string;
            dishId: string;
            tierId: string;
            price: number;
        })[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        description: string | null;
        image: string | null;
        sku: string;
        temperature: import(".prisma/client").$Enums.Temperature;
        costPrice: number;
        allergens: string[];
        dietaryTags: string[];
        kitchenStation: string | null;
        minOrderQuantity: number;
        categoryId: string;
    })[]>;
    getDish(id: string): Promise<({
        category: {
            order: number;
            id: string;
            name: string;
            isActive: boolean;
            isSecret: boolean;
        };
        optionGroups: ({
            options: {
                id: string;
                name: string;
                allergens: string[];
                dietaryTags: string[];
                displayOrder: number;
                cost: number;
                portions: import("@prisma/client/runtime/library").JsonValue | null;
                groupId: string;
            }[];
        } & {
            id: string;
            name: string;
            isRequired: boolean;
            displayOrder: number;
            usesPortions: boolean;
            dishId: string;
        })[];
        prices: ({
            tier: {
                id: string;
                name: string;
                isDefault: boolean;
                derivedFrom: string | null;
            };
        } & {
            id: string;
            dishId: string;
            tierId: string;
            price: number;
        })[];
    } & {
        id: string;
        name: string;
        isActive: boolean;
        description: string | null;
        image: string | null;
        sku: string;
        temperature: import(".prisma/client").$Enums.Temperature;
        costPrice: number;
        allergens: string[];
        dietaryTags: string[];
        kitchenStation: string | null;
        minOrderQuantity: number;
        categoryId: string;
    }) | null>;
    createDish(body: any): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        description: string | null;
        image: string | null;
        sku: string;
        temperature: import(".prisma/client").$Enums.Temperature;
        costPrice: number;
        allergens: string[];
        dietaryTags: string[];
        kitchenStation: string | null;
        minOrderQuantity: number;
        categoryId: string;
    }>;
    updateDish(id: string, body: any): Promise<{
        id: string;
        name: string;
        isActive: boolean;
        description: string | null;
        image: string | null;
        sku: string;
        temperature: import(".prisma/client").$Enums.Temperature;
        costPrice: number;
        allergens: string[];
        dietaryTags: string[];
        kitchenStation: string | null;
        minOrderQuantity: number;
        categoryId: string;
    }>;
    createOptionGroup(body: any): Promise<{
        id: string;
        name: string;
        isRequired: boolean;
        displayOrder: number;
        usesPortions: boolean;
        dishId: string;
    }>;
    createOption(body: any): Promise<{
        id: string;
        name: string;
        allergens: string[];
        dietaryTags: string[];
        displayOrder: number;
        cost: number;
        portions: import("@prisma/client/runtime/library").JsonValue | null;
        groupId: string;
    }>;
}
