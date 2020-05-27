import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { css, ThemeProps, withTheme } from "styled-components";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import translate from "@insite/client-framework/Translate";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Button, { ButtonIcon, ButtonPresentationProps } from "@insite/mobius/Button";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import ChevronLeft from "@insite/mobius/Icons/ChevronLeft";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import EmblaCarousel from "embla-carousel";
import EmblaCarouselReact from "embla-carousel-react";
import loadCarouselProducts from "@insite/client-framework/Store/Components/ProductCarousel/Handlers/LoadCarouselProducts";
import ProductCarouselProduct, { ProductCarouselProductStyles } from "@insite/content-library/Components/ProductCarouselProduct";
import SkipNav, { SkipNavStyles } from "@insite/content-library/Components/SkipNav";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { BrandStateContext } from "@insite/client-framework/Store/Data/Brands/BrandsSelectors";
import { CategoryContext } from "@insite/client-framework/Components/CategoryContext";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";

const enum fields {
    title = "title",
    carouselType = "carouselType",
    displayProductsFrom = "displayProductsFrom",
    selectedCategoryIds = "selectedCategoryIds",
    relatedProductType = "relatedProductType",
    numberOfProductsToDisplay = "numberOfProductsToDisplay",
    seedWithManuallyAssigned = "seedWithManuallyAssigned",
    maxNumberOfColumns = "maxNumberOfColumns",
    showImage = "showImage",
    showTitle = "showTitle",
    showBrandName = "showBrandName",
    showPartNumbers = "showPartNumbers",
    showPrice = "showPrice",
    showAddToCart = "showAddToCart",
    showAddToList = "showAddToList",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.title]: string;
        [fields.carouselType]: string;
        [fields.displayProductsFrom]: string;
        [fields.selectedCategoryIds]: string[];
        [fields.relatedProductType]: string;
        [fields.numberOfProductsToDisplay]: number;
        [fields.seedWithManuallyAssigned]: string;
        [fields.maxNumberOfColumns]: number;
        [fields.showImage]: boolean;
        [fields.showTitle]: boolean;
        [fields.showBrandName]: boolean;
        [fields.showPartNumbers]: boolean;
        [fields.showPrice]: boolean;
        [fields.showAddToCart]: boolean;
        [fields.showAddToList]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    products: state.components.productCarousel.carouselProducts[ownProps.id]?.value,
    parentProduct: state.pages.productDetail.product,
    pageType: getCurrentPage(state).type,
});

const mapDispatchToProps = {
    loadCarouselProducts,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & ThemeProps<BaseTheme> & HasShellContext;

export interface ProductCarouselStyles {
    titleText?: TypographyPresentationProps;
    skipCarouselButton?: SkipNavStyles;
    mainContainer?: GridContainerProps;
    prevArrowGridItem?: GridItemProps;
    prevArrowButton?: ButtonPresentationProps;
    nextArrowGridItem?: GridItemProps;
    nextArrowButton?: ButtonPresentationProps;
    carouselGridItem?: GridItemProps;
    carouselWrapper?: InjectableCss;
    carouselSlidesContainer?: InjectableCss;
    carouselSlide?: InjectableCss;
    carouselSlideInner?: InjectableCss;
    carouselProductStyles?: ProductCarouselProductStyles;
}

const styles: ProductCarouselStyles = {
    titleText: {
        variant: "h2",
        css: css`
            text-align: center;
            margin-bottom: 10px;
        `,
    },
    mainContainer: { gap: 0 },
    prevArrowGridItem: {
        width: 1,
        align: "middle",
        css: css`
            justify-content: flex-start;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css` flex-basis: 5%; max-width: 5%; `,
                    css` flex-basis: 5%; max-width: 5%; `,
                    css` flex-basis: 5%; max-width: 5%; `,
                    css` flex-basis: 5%; max-width: 5%; `,
                    css` flex-basis: 5%; max-width: 5%; `,
                ])}
        `,
    },
    prevArrowButton: {
        variant: "secondary",
        color: "text.main",
        css: css`
            border: 0;
            padding: 0;
        `,
    },
    nextArrowGridItem: {
        width: 1,
        align: "middle",
        css: css`
            justify-content: flex-end;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css` flex-basis: 5%; max-width: 5%; `,
                    css` flex-basis: 5%; max-width: 5%; `,
                    css` flex-basis: 5%; max-width: 5%; `,
                    css` flex-basis: 5%; max-width: 5%; `,
                    css` flex-basis: 5%; max-width: 5%; `,
                ])}
        `,
    },
    nextArrowButton: {
        variant: "secondary",
        color: "text.main",
        css: css`
            border: 0;
            padding: 0;
        `,
    },
    carouselGridItem: {
        width: 10,
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css` flex-basis: 90%; max-width: 90%; `,
                    css` flex-basis: 90%; max-width: 90%; `,
                    css` flex-basis: 90%; max-width: 90%; `,
                    css` flex-basis: 90%; max-width: 90%; `,
                    css` flex-basis: 90%; max-width: 90%; `,
                ])}
        `,
    },
    carouselWrapper: {
        css: css`
            width: 100%;
            position: relative;
        `,
    },
    carouselSlidesContainer: {
        css: css` display: flex; `,
    },
    carouselSlide: {
        css: css`
            padding: 0;
            position: relative;
            flex: 0 0 auto;
        `,
    },
    carouselSlideInner: {
        css: css`
            width: 100%;
            height: 100%;
            position: relative;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
        `,
    },
};

export const productCarouselStyles = styles;

const ProductCarousel: React.FC<Props> = ({
    id,
    theme,
    fields,
    products,
    parentProduct,
    loadCarouselProducts,
    pageType,
    shellContext,
}) => {
    const afterCarousel = React.createRef<HTMLSpanElement>();
    const isProductDetailsPage = pageType === "ProductDetailPage";
    const isProductListPage = pageType === "ProductListPage";
    const isBrandDetailsPage = pageType === "BrandDetailsPage";
    const brand = React.useContext(BrandStateContext).value;
    const category = React.useContext(CategoryContext);

    const loadProducts = React.useCallback(
        () => {
            loadCarouselProducts({
                carouselId: id,
                carouselType: fields.carouselType,
                relatedProductType: fields.relatedProductType,
                seedWithManuallyAssigned: fields.seedWithManuallyAssigned,
                displayProductsFrom: fields.displayProductsFrom,
                selectedCategoryIds: fields.selectedCategoryIds,
                numberOfProductsToDisplay: fields.numberOfProductsToDisplay,
                isProductDetailsPage,
                parentProduct,
                isProductListPage,
                category,
                isBrandDetailsPage,
                brand,
            });
        },
        [
            fields.carouselType,
            fields.relatedProductType,
            fields.seedWithManuallyAssigned,
            fields.displayProductsFrom,
            fields.selectedCategoryIds,
            fields.numberOfProductsToDisplay,
            parentProduct,
            category,
            brand,
        ],
    );

    React.useEffect(
        () => {
            loadProducts();
        },
        [
            fields.carouselType,
            fields.relatedProductType,
            fields.seedWithManuallyAssigned,
            fields.displayProductsFrom,
            fields.selectedCategoryIds,
            fields.numberOfProductsToDisplay,
            parentProduct,
            category,
            brand,
        ],
    );

    const [embla, setEmbla] = React.useState<EmblaCarousel | null>(null);
    const [windowResizeTime, setWindowResizeTime] = React.useState(0);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);
    const setCanScroll = () => {
        if (shellContext.isInShell) return;
        setCanScrollPrev(!!embla && embla.canScrollPrev());
        setCanScrollNext(!!embla && embla.canScrollNext());
    };

    const getSlidesToScroll = React.useCallback(
        () => {
            const maxNumberOfColumns = fields.maxNumberOfColumns || 4;
            if (typeof window === "undefined") {
                return maxNumberOfColumns;
            }

            let localSlidesToScroll: number;
            if (window.innerWidth < theme.breakpoints.values[1]) {
                localSlidesToScroll = 1;
            } else if (window.innerWidth < theme.breakpoints.values[2]) {
                localSlidesToScroll = 2;
            } else if (window.innerWidth < theme.breakpoints.values[3]) {
                localSlidesToScroll = 3;
            } else {
                localSlidesToScroll = 4;
            }
            return Math.min(localSlidesToScroll, maxNumberOfColumns);
        },
        [fields.maxNumberOfColumns],
    );

    const [slidesToScroll, setSlidesToScroll] = React.useState(getSlidesToScroll());

    const getDraggable = () => {
        if (typeof window === "undefined") {
            return false;
        }

        return window.innerWidth < theme.breakpoints.values[1];
    };

    const [draggable, setDraggable] = React.useState(getDraggable());

    React.useEffect(
        () => {
            const newSlidesToScroll = getSlidesToScroll();
            setSlidesToScroll(newSlidesToScroll);

            const newDraggable = getDraggable();
            setDraggable(newDraggable);
        },
        [fields.maxNumberOfColumns, windowResizeTime],
    );

    React.useEffect(
        () => {
            if (!embla) {
                return;
            }

            embla.on("init", setCanScroll);
            embla.on("select", setCanScroll);

            const onWindowResize = () => {
                setWindowResizeTime(Date.now());
            };

            window.addEventListener("resize", onWindowResize);
            onWindowResize();

            return () => {
                window.removeEventListener("resize", onWindowResize);
                if (!shellContext.isInShell) embla.destroy();
            };
        },
        [embla],
    );

    React.useEffect(
        () => {
            if (!embla || !products) {
                return;
            }

            embla.changeOptions({ slidesToScroll, draggable, loop: products.length > slidesToScroll });
            setCanScroll();
        },
        [slidesToScroll, draggable, products],
    );

    if (!products || products.length === 0) {
        return null;
    }

    const title = fields.title || carouselTypeOptions.find(o => o.value === fields.carouselType)?.displayName || "Product Carousel";
    const showBrandBlocks = fields.showBrandName && products.some(o => !!o.brand);

    return <>
        <SkipNav text={translate("Skip Carousel")} extendedStyles={styles.skipCarouselButton} destination={afterCarousel} />
        <Typography {...styles.titleText}>{translate(title)}</Typography>
        <GridContainer {...styles.mainContainer} data-test-selector={`productCarousel_${fields.carouselType}${fields.relatedProductType}`}>
            <GridItem {...styles.prevArrowGridItem}>
                {products.length > slidesToScroll
                    && <Button
                        {...styles.prevArrowButton}
                        onClick={() => embla && embla.scrollPrev()}
                        disabled={!canScrollPrev}
                        data-test-selector="prevBtn"
                    >
                        <ButtonIcon src={ChevronLeft} />
                    </Button>
                }
            </GridItem>
            <GridItem {...styles.carouselGridItem}>
                <StyledWrapper {...styles.carouselWrapper}>
                    <EmblaCarouselReact emblaRef={setEmbla} options={{ align: "start", slidesToScroll, loop: products.length > slidesToScroll, draggable }}>
                        <StyledWrapper {...styles.carouselSlidesContainer} data-test-selector="slides">
                            {products.map(product =>
                                <StyledWrapper {...styles.carouselSlide} key={product.id} style={{ width: `calc(100% / ${slidesToScroll})` }}>
                                    <StyledWrapper {...styles.carouselSlideInner} id={`product_${product.id}`} data-test-selector="productContainer">
                                        <ProductCarouselProduct
                                            carouselId={id}
                                            product={product}
                                            showImage={fields.showImage}
                                            showBrand={showBrandBlocks}
                                            showTitle={fields.showTitle}
                                            showPartNumbers={fields.showPartNumbers}
                                            showPrice={fields.showPrice}
                                            showAddToCart={fields.showAddToCart}
                                            showAddToList={fields.showAddToList}
                                            extendedStyles={styles.carouselProductStyles} />
                                    </StyledWrapper>
                                </StyledWrapper>)
                            }
                        </StyledWrapper>
                    </EmblaCarouselReact>
                </StyledWrapper>
            </GridItem>
            <GridItem {...styles.nextArrowGridItem}>
                {products.length > slidesToScroll
                    && <Button
                        {...styles.nextArrowButton}
                        onClick={() => embla && embla.scrollNext()}
                        disabled={!canScrollNext}
                        data-test-selector="nextBtn"
                    >
                        <ButtonIcon src={ChevronRight} />
                    </Button>
                }
            </GridItem>
        </GridContainer>
        <span ref={afterCarousel} tabIndex={-1}/>
    </>;
};

const carouselTypeOptions = [
    { value: "crossSells", displayName: "Cross Sells" },
    { value: "customersAlsoPurchased", displayName: "Customers Also Purchased" },
    { value: "recentlyViewed", displayName: "Recently Viewed" },
    { value: "relatedProducts", displayName: "Related Products" },
    { value: "topSellers", displayName: "Top Sellers" },
];

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withIsInShell(withTheme(ProductCarousel))),
    definition: {
        group: "Common",
        icon: "Carousel",
        fieldDefinitions: [
            {
                name: fields.title,
                displayName: "Title",
                editorTemplate: "TextField",
                defaultValue: "",
                fieldType: "General",
                sortOrder: 0,
            },
            {
                name: fields.carouselType,
                displayName: "Carousel Type",
                editorTemplate: "DropDownField",
                options: carouselTypeOptions,
                defaultValue: "crossSells",
                fieldType: "General",
                sortOrder: 1,
            },
            {
                name: fields.displayProductsFrom,
                displayName: "Display Products From",
                editorTemplate: "DropDownField",
                options: [
                    { value: "allCategories", displayName: "All Categories" },
                    { value: "selectedCategories", displayName: "Selected Categories" },
                    { value: "customerSegments", displayName: "Customer Segments" },
                ],
                defaultValue: "allCategories",
                fieldType: "General",
                isVisible: (item) => item.fields[fields.carouselType] === "topSellers",
                sortOrder: 2,
            },
            {
                name: fields.selectedCategoryIds,
                displayName: "Selected Categories",
                editorTemplate: "CategoriesField",
                defaultValue: [],
                fieldType: "General",
                isVisible: (item) => item.fields[fields.carouselType] === "topSellers" && item.fields[fields.displayProductsFrom] === "selectedCategories",
                sortOrder: 3,
            },
            {
                name: fields.relatedProductType,
                displayName: "Related Product Type",
                editorTemplate: "DropDownField",
                options: [
                    { value: "CrossSell", displayName: "Cross Sell" },
                    { value: "Accessory", displayName: "Accessory" },
                ],
                defaultValue: "",
                fieldType: "General",
                isVisible: (item) => item.fields[fields.carouselType] === "relatedProducts",
                sortOrder: 4,
            },
            {
                name: fields.numberOfProductsToDisplay,
                displayName: "Number Of Products To Display",
                editorTemplate: "IntegerField",
                min: 1,
                max: 20,
                defaultValue: 10,
                fieldType: "General",
                isVisible: (item) => item.fields[fields.carouselType] === "customersAlsoPurchased",
                sortOrder: 5,
            },
            {
                name: fields.seedWithManuallyAssigned,
                displayName: "Seed With Manually Assigned",
                editorTemplate: "DropDownField",
                options: [
                    { value: "ProductRelationship", displayName: "Product Relationship" },
                    { value: "CrossSell", displayName: "Cross Sell" },
                    { value: "Accessory", displayName: "Accessory" },
                ],
                defaultValue: "",
                fieldType: "General",
                isVisible: (item) => item.fields[fields.carouselType] === "customersAlsoPurchased",
                sortOrder: 6,
            },
            {
                name: fields.maxNumberOfColumns,
                displayName: "Max Number Of Columns",
                editorTemplate: "IntegerField",
                min: 1,
                max: 4,
                defaultValue: 4,
                fieldType: "General",
                sortOrder: 7,
            },
            {
                name: fields.showImage,
                displayName: "Image",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                isEnabled: () => false,
                fieldType: "General",
                sortOrder: 8,
            },
            {
                name: fields.showTitle,
                displayName: "Title",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                isEnabled: () => false,
                fieldType: "General",
                sortOrder: 9,
            },
            {
                name: fields.showBrandName,
                displayName: "Brand Name",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 10,
            },
            {
                name: fields.showPartNumbers,
                displayName: "Part Numbers",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 11,
            },
            {
                name: fields.showPrice,
                displayName: "Price",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 12,
            },
            {
                name: fields.showAddToCart,
                displayName: "Add To Cart",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 13,
            },
            {
                name: fields.showAddToList,
                displayName: "Add To List",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                fieldType: "General",
                sortOrder: 14,
            },
        ],
    },
};

export default widgetModule;