export type IPOStatus = 'upcoming' | 'open' | 'closed';
export type IssueType = 'book-built' | 'fixed-price';

export interface IPO {
    _id: string;
    companyName: string;
    symbol: string;
    industry: string;
    logo?: string;

    priceRange: {
        min: number;
        max: number;
    };
    lotSize: number;
    issueSize: string;
    issueType: IssueType;

    openDate: string;
    closeDate: string;
    listingDate?: string;
    status: IPOStatus;

    overview: string;
    strengths: string[];
    risks: string[];

    financialHighlights: {
        revenue?: string;
        profit?: string;
        year?: string;
    }[];

    drhpLink?: string;

    createdAt: string;
    updatedAt: string;
}

export interface IPOWatchlistItem {
    _id: string;
    user: string;
    ipo: IPO;
    notifyOnOpen: boolean;
    notifyOnClose: boolean;
    addedAt: string;
}
