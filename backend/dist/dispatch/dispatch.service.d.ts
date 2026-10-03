import { PrismaService } from '../prisma/prisma.service';
export declare class DispatchService {
    private prisma;
    constructor(prisma: PrismaService);
    getDrops(date: string): Promise<any[]>;
    getDrivers(): Promise<{
        id: string;
        email: string;
    }[]>;
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
            firstName: string;
            lastName: string;
            companyId: string;
            canChooseAddress: boolean;
            canChangeTime: boolean;
            canChangePackaging: boolean;
            allergens: string[];
            dietaryTags: string[];
        };
        lines: {
            id: string;
            orderId: string;
            dishId: string;
            dishQuantity: number;
            dishPrice: number;
        }[];
    } & {
        id: string;
        deliveryAddress: string;
        deliveryTime: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        deliveryDate: Date;
        packaging: string;
        totalAmount: number;
        kitchenStartedAt: Date | null;
        kitchenReadyAt: Date | null;
        dispatchReadyAt: Date | null;
        outForDeliveryAt: Date | null;
        deliveredAt: Date | null;
        deliveryNote: string | null;
        deliveryPhoto: string | null;
        isOnTime: boolean | null;
        employeeId: string;
        driverId: string | null;
        invoiceId: string | null;
    })[]>;
    markDelivered(orderId: string, data: {
        note?: string;
        photo?: string;
        isOnTime?: boolean;
    }): Promise<{
        id: string;
        deliveryAddress: string;
        deliveryTime: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        deliveryDate: Date;
        packaging: string;
        totalAmount: number;
        kitchenStartedAt: Date | null;
        kitchenReadyAt: Date | null;
        dispatchReadyAt: Date | null;
        outForDeliveryAt: Date | null;
        deliveredAt: Date | null;
        deliveryNote: string | null;
        deliveryPhoto: string | null;
        isOnTime: boolean | null;
        employeeId: string;
        driverId: string | null;
        invoiceId: string | null;
    }>;
}
