import { DispatchService } from './dispatch.service';
export declare class DispatchController {
    private dispatchService;
    constructor(dispatchService: DispatchService);
    getDrops(date: string): Promise<any[]>;
    getDrivers(): Promise<{
        id: string;
        email: string;
    }[]>;
    assignDriver(dropKey: string, body: {
        driverId: string;
    }): Promise<import(".prisma/client").Prisma.BatchPayload>;
    markOutForDelivery(dropKey: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    getMyDeliveries(req: any): Promise<({
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
    markDelivered(orderId: string, body: any): Promise<{
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
