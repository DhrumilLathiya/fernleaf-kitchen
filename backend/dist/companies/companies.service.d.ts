import { PrismaService } from '../prisma/prisma.service';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    getAll(): Promise<({
        priceTier: {
            id: string;
            name: string;
            isDefault: boolean;
            derivedFrom: string | null;
        } | null;
        _count: {
            employees: number;
        };
        defaultDriver: {
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.StaffRole;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: string;
        name: string;
        emailDomains: string[];
        deliveryAddresses: string[];
        billingContact: string;
        ownerId: string | null;
        priceTierId: string | null;
        defaultDeliveryTime: string | null;
        deliveryMinutes: number;
        defaultPackaging: string | null;
        driverInstructions: string | null;
        defaultDriverId: string | null;
        hiddenCategoryIds: string[];
        hiddenDishIds: string[];
    })[]>;
    getOne(id: string): Promise<({
        priceTier: {
            id: string;
            name: string;
            isDefault: boolean;
            derivedFrom: string | null;
        } | null;
        employees: {
            id: string;
            email: string;
            allergens: string[];
            dietaryTags: string[];
            firstName: string;
            lastName: string;
            companyId: string;
            canChooseAddress: boolean;
            canChangeTime: boolean;
            canChangePackaging: boolean;
        }[];
        invoices: {
            id: string;
            createdAt: Date;
            companyId: string;
            isPaid: boolean;
        }[];
    } & {
        id: string;
        name: string;
        emailDomains: string[];
        deliveryAddresses: string[];
        billingContact: string;
        ownerId: string | null;
        priceTierId: string | null;
        defaultDeliveryTime: string | null;
        deliveryMinutes: number;
        defaultPackaging: string | null;
        driverInstructions: string | null;
        defaultDriverId: string | null;
        hiddenCategoryIds: string[];
        hiddenDishIds: string[];
    }) | null>;
    create(data: any): Promise<{
        id: string;
        name: string;
        emailDomains: string[];
        deliveryAddresses: string[];
        billingContact: string;
        ownerId: string | null;
        priceTierId: string | null;
        defaultDeliveryTime: string | null;
        deliveryMinutes: number;
        defaultPackaging: string | null;
        driverInstructions: string | null;
        defaultDriverId: string | null;
        hiddenCategoryIds: string[];
        hiddenDishIds: string[];
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        emailDomains: string[];
        deliveryAddresses: string[];
        billingContact: string;
        ownerId: string | null;
        priceTierId: string | null;
        defaultDeliveryTime: string | null;
        deliveryMinutes: number;
        defaultPackaging: string | null;
        driverInstructions: string | null;
        defaultDriverId: string | null;
        hiddenCategoryIds: string[];
        hiddenDishIds: string[];
    }>;
}
