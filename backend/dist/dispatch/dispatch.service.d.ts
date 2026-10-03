import { PrismaService } from '../prisma/prisma.service';
export declare class DispatchService {
    private prisma;
    constructor(prisma: PrismaService);
    getDrops(date: string): Promise<any[]>;
    assignDriver(dropKey: string, driverId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getMyDeliveries(driverId: string): Promise<({
        employee: {
            company: {
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
            };
        } & {
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
        };
        lines: {
            dishPrice: number;
            id: string;
            dishId: string;
            orderId: string;
            dishQuantity: number;
        }[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        employeeId: string;
        deliveryDate: Date;
        deliveryTime: string;
        deliveryAddress: string;
        packaging: string;
        totalAmount: number;
        kitchenStartedAt: Date | null;
        kitchenReadyAt: Date | null;
        dispatchReadyAt: Date | null;
        outForDeliveryAt: Date | null;
        deliveredAt: Date | null;
        driverId: string | null;
        deliveryNote: string | null;
        deliveryPhoto: string | null;
        isOnTime: boolean | null;
        invoiceId: string | null;
    })[]>;
    markDelivered(orderId: string, data: {
        note?: string;
        photo?: string;
        isOnTime?: boolean;
    }): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        employeeId: string;
        deliveryDate: Date;
        deliveryTime: string;
        deliveryAddress: string;
        packaging: string;
        totalAmount: number;
        kitchenStartedAt: Date | null;
        kitchenReadyAt: Date | null;
        dispatchReadyAt: Date | null;
        outForDeliveryAt: Date | null;
        deliveredAt: Date | null;
        driverId: string | null;
        deliveryNote: string | null;
        deliveryPhoto: string | null;
        isOnTime: boolean | null;
        invoiceId: string | null;
    }>;
}
