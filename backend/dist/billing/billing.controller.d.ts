import { BillingService } from './billing.service';
export declare class BillingController {
    private billingService;
    constructor(billingService: BillingService);
    listInvoices(companyId?: string): Promise<({
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
        orders: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        companyId: string;
        isPaid: boolean;
    })[]>;
    getUnInvoiced(companyId: string): Promise<({
        employee: {
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
        lines: ({
            dish: {
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
            };
            combinations: {
                id: string;
                kitchenStation: string | null;
                quantity: number;
                totalPrice: number;
                chosenOptions: import("@prisma/client/runtime/library").JsonValue;
                isStarted: boolean;
                isDone: boolean;
                startedAt: Date | null;
                doneAt: Date | null;
                orderLineId: string;
            }[];
        } & {
            dishPrice: number;
            id: string;
            dishId: string;
            orderId: string;
            dishQuantity: number;
        })[];
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
    createInvoice(body: {
        companyId: string;
        orderIds: string[];
    }): Promise<{
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
        orders: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        companyId: string;
        isPaid: boolean;
    }>;
    markPaid(invoiceId: string): Promise<{
        id: string;
        createdAt: Date;
        companyId: string;
        isPaid: boolean;
    }>;
}
