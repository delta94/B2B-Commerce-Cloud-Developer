import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import translate from "@insite/client-framework/Translate";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqQuoteDetails.quoteId),
});

type Props = ReturnType<typeof mapStateToProps>;

export interface RfqQuoteDetailsRequestedDetailsGridStyles {
    mainWrapper?: InjectableCss;
    headerWrapper?: InjectableCss;
    countLabelText?: TypographyPresentationProps;
    countValueText?: TypographyPresentationProps;
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    quoteLineInfoGridItem?: GridItemProps;
    quoteLineInfoContainer?: GridContainerProps;
    infoLeftColumn?: GridItemProps;
    infoLeftColumnContainer?: GridContainerProps;
    productBrandAndDescriptionGridItem?: GridItemProps;
    productBrand?: ProductBrandStyles;
    productDescription?: ProductDescriptionStyles;
    productPartNumbers?: ProductPartNumbersStyles;
    productPrice?: ProductPriceStyles;
    quantityAndSubtotalGridItem?: GridItemProps;
    quantityAndSubtotalContainer?: GridContainerProps;
    quantityGridItem?: GridItemProps;
    quantityHeadingAndText?: SmallHeadingAndTextStyles;
    subtotalGridItem?: GridItemProps;
    subtotalText?: TypographyPresentationProps;
    footerWrapper?: InjectableCss;
    totalLabelText?: TypographyPresentationProps;
    totalValueText?: TypographyPresentationProps;
}

export const rfqQuoteDetailsRequestedDetailsGridStyles: RfqQuoteDetailsRequestedDetailsGridStyles = {
    headerWrapper: {
        css: css`
            display: flex;
            padding-bottom: 15px;
            border-bottom: 1px solid ${getColor("common.border")};
        `,
    },
    countLabelText: {
        weight: 600,
        css: css` margin-left: 5px; `,
    },
    countValueText: {
        weight: 600,
    },
    container: {
        gap: 20,
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding: 1rem 0;
        `,
    },
    productImageGridItem: {
        width: 2,
    },
    quoteLineInfoGridItem: {
        width: 10,
    },
    quoteLineInfoContainer: {
        gap: 20,
    },
    infoLeftColumn: {
        width: [12, 12, 12, 8, 8],
    },
    infoLeftColumnContainer: {
        gap: 10,
    },
    productBrandAndDescriptionGridItem: {
        css: css` flex-direction: column; `,
        width: 12,
    },
    productPrice: {
        wrapper: {
            css: css` margin-top: 10px; `,
        },
    },
    quantityAndSubtotalGridItem: {
        width: [12, 12, 12, 4, 4],
    },
    quantityAndSubtotalContainer: {
        gap: 10,
    },
    quantityGridItem: {
        width: 6,
    },
    quantityHeadingAndText: {
        heading: {
            weight: "bold",
            size: 14,
        },
    },
    subtotalGridItem: {
        width: 6,
        align: "bottom",
    },
    subtotalText: {
        weight: 700,
    },
    footerWrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        `,
    },
    totalLabelText: {
        size: 20,
        weight: "bold",
        css: css` margin-right: 10px; `,
    },
    totalValueText: {
        size: 20,
    },
};

const styles = rfqQuoteDetailsRequestedDetailsGridStyles;

const RfqQuoteDetailsRequestedDetailsGrid = ({
    quoteState,
}: Props) => {
    const quote = quoteState.value;
    if (!quote || !quote.quoteLineCollection) {
        return null;
    }

    return <StyledWrapper {...styles.mainWrapper}>
        <StyledWrapper {...styles.headerWrapper}>
            <Typography as="p" {...styles.countValueText}>
                {quote.quoteLineCollection.length}
                <Typography {...styles.countLabelText}>{quote.quoteLineCollection.length > 1 ? translate("Products") : translate("Product")}</Typography>
            </Typography>
        </StyledWrapper>
        {quote.quoteLineCollection.map(quoteLine => (
            <GridContainer {...styles.container} key={`${quoteLine.productId}_${quoteLine.unitOfMeasure}`}>
                <GridItem {...styles.productImageGridItem}>
                    <ProductImage product={quoteLine} extendedStyles={styles.productImage} />
                </GridItem>
                <GridItem {...styles.quoteLineInfoGridItem}>
                    <GridContainer {...styles.quoteLineInfoContainer}>
                        <GridItem {...styles.infoLeftColumn}>
                            <GridContainer {...styles.infoLeftColumnContainer}>
                                <GridItem {...styles.productBrandAndDescriptionGridItem}>
                                    {quoteLine.brand
                                        && <ProductBrand brand={quoteLine.brand} extendedStyles={styles.productBrand} />
                                    }
                                    <ProductDescription product={quoteLine} extendedStyles={styles.productDescription} />
                                    <ProductPartNumbers
                                        productNumber={quoteLine.erpNumber}
                                        customerProductNumber={quoteLine.customerName}
                                        manufacturerItem={quoteLine.manufacturerItem}
                                        extendedStyles={styles.productPartNumbers}
                                    />
                                    <ProductPrice
                                        product={quoteLine}
                                        currencySymbol={quote.currencySymbol}
                                        showLabel={false}
                                        showSavings={true}
                                        showSavingsAmount={true}
                                        showSavingsPercent={true}
                                        extendedStyles={styles.productPrice} />
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                        <GridItem {...styles.quantityAndSubtotalGridItem}>
                            <GridContainer {...styles.quantityAndSubtotalContainer}>
                                <GridItem {...styles.quantityGridItem}>
                                    <SmallHeadingAndText
                                        heading={translate("QTY_quantity")}
                                        text={quoteLine.qtyOrdered || 1}
                                        extendedStyles={styles.quantityHeadingAndText}
                                    />
                                </GridItem>
                                <GridItem {...styles.subtotalGridItem}>
                                    {quoteLine.pricing
                                        && <>
                                            <VisuallyHidden>{translate("Subtotal")}</VisuallyHidden>
                                            <Typography {...styles.subtotalText} >{quoteLine.pricing.extendedUnitNetPriceDisplay}</Typography>
                                        </>
                                    }
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                    </GridContainer>
                </GridItem>
            </GridContainer>
        ))}
        <StyledWrapper {...styles.footerWrapper}>
            <Typography {...styles.totalValueText} as="p">
                <Typography {...styles.totalLabelText}>{translate("Total")}:</Typography>
                {quote.orderSubTotalDisplay}
            </Typography>
        </StyledWrapper>
    </StyledWrapper>;
};

export default connect(mapStateToProps)(RfqQuoteDetailsRequestedDetailsGrid);
