import { PrismaService } from '../prisma/prisma.service';
export declare class CatalogueService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(): Promise<{
        order: number;
        id: string;
        name: string;
        isActive: boolean;
        isSecret: boolean;
    }[]>;
    createCategory(data: {
        name: string;
        order: number;
        isSecret?: boolean;
    }): Promise<{
        order: number;
        id: string;
        name: string;
        isActive: boolean;
        isSecret: boolean;
    }>;
    getDishes(isActive?: boolean): Promise<({
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
    createDish(data: {
        name: string;
        description?: string;
        sku: string;
        temperature: 'HOT' | 'COLD';
        costPrice: number;
        allergens?: string[];
        dietaryTags?: string[];
        kitchenStation?: string;
        minOrderQuantity?: number;
        categoryId: string;
    }): Promise<{
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
    updateDish(id: string, data: Partial<{
        name: string;
        description: string;
        costPrice: number;
        allergens: string[];
        dietaryTags: string[];
        kitchenStation: string;
        minOrderQuantity: number;
        isActive: boolean;
        categoryId: string;
    }>): Promise<{
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
    createOptionGroup(data: {
        name: string;
        isRequired: boolean;
        displayOrder: number;
        dishId: string;
        usesPortions?: boolean;
    }): Promise<{
        id: string;
        name: string;
        isRequired: boolean;
        displayOrder: number;
        usesPortions: boolean;
        dishId: string;
    }>;
    createOption(data: {
        name: string;
        cost: number;
        allergens?: string[];
        dietaryTags?: string[];
        displayOrder: number;
        groupId: string;
        portions?: object;
    }): Promise<{
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
