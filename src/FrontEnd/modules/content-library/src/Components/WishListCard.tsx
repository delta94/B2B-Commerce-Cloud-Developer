import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import { ShareOptions } from "@insite/client-framework/Services/WishListService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import addWishListToCart from "@insite/client-framework/Store/Pages/Cart/Handlers/AddWishListToCart";
import translate from "@insite/client-framework/Translate";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";
import MyListsDetailsPageTypeLink from "@insite/content-library/Components/MyListsDetailsPageTypeLink";
import WishListSharingStatus, { WishListSharingStatusStyles } from "@insite/content-library/Components/WishListSharingStatus";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import { IconPresentationProps } from "@insite/mobius/Icon";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React, { useContext } from "react";
import { connect, HandleThunkActionCreator } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    language: state.context.session.language,
    allowEditingOfWishLists: getSettingsCollection(state).wishListSettings.allowEditingOfWishLists,
});

interface OwnProps {
    wishList: WishListModel;
    extendedStyles?: WishListCardStyles;
    addWishListToCart: HandleThunkActionCreator<typeof addWishListToCart>;
    deleteWishList?: () => void;
    leaveWishList?: () => void;
}

type Props = ReturnType<typeof mapStateToProps> & OwnProps;

export interface WishListCardStyles {
    gridContainer?: GridContainerProps;
    wishListInfoGridItem?: GridItemProps;
    wishListInfoGridContainer?: GridContainerProps;
    basicInfoGridItem?: GridItemProps;
    basicInfoGridContainer?: GridContainerProps;
    detailLinkGridItem?: GridItemProps;
    descriptionGridItem?: GridItemProps;
    descriptionText?: TypographyProps;
    lastUpdatedGridItem?: GridItemProps;
    lastUpdatedText?: TypographyProps;
    extendedInfoGridItem?: GridItemProps;
    extendedInfoGridContainer?: GridContainerProps;
    productImagesGridItem?: GridItemProps;
    productImageLink?: LinkPresentationProps;
    productImage?: LazyImageProps;
    sharingStatusGridItem?: GridItemProps;
    sharingStatus?: WishListSharingStatusStyles;
    actionGridItem?: GridItemProps;
    actionGridMediumHidden?: HiddenProps;
    actionOverflowIcon?: IconPresentationProps;
    actionOverflowMenu?: OverflowMenuPresentationProps;
    actionAddToCartClickable?: ClickablePresentationProps;
    actionDeleteClickable?: ClickablePresentationProps;
    actionLeaveClickable?: ClickablePresentationProps;
    actionAddToCartButton?: ButtonPresentationProps;
    actionDeleteButton?: ButtonPresentationProps;
    actionLeaveButton?: ButtonPresentationProps;
}

export const wishListCardStyles: WishListCardStyles = {
    gridContainer: {
        gap: 5,
    },
    wishListInfoGridItem: {
        width: [10, 10, 8, 10, 10],
        align: "middle",
    },
    basicInfoGridItem: { width: [12, 12, 5, 4, 4] },
    basicInfoGridContainer: {
        gap: 10,
    },
    detailLinkGridItem: { width: 12 },
    descriptionGridItem: { width: 12 },
    lastUpdatedGridItem: { width: 12 },
    extendedInfoGridItem: {
        width: [12, 12, 7, 8, 8],
        align: "middle",
    },
    productImageLink: { css: css` margin-right: 5px; ` },
    productImagesGridItem: {
        width: [12, 12, 12, 8, 8],
        css: css` flex-wrap: wrap; `,
    },
    productImage: {
        css: css`
            max-width: 75px;
            img {
                height: 100%;
            }
        `,
        errorTypographyProps: {
            size: 11,
            css: css` max-height: 65px; `,
        },
    },
    sharingStatusGridItem: { width: [12, 12, 12, 4, 4] },
    actionGridItem: {
        width: [2, 2, 4, 2, 2],
        align: "top",
        css: css`
            justify-content: flex-end;
        `,
    },
    actionGridMediumHidden: {
        css: css` width: 100%; `,
    },
    actionAddToCartButton: {
        color: "secondary",
        css: css`
            white-space: nowrap;
            width: 100%;
            padding: 0 10px;
        `, // keep text from wrapping
    },
    actionDeleteButton: {
        variant: "secondary",
        css: css`
            width: 100%;
            margin-top: 10px;
        `,
    },
    actionLeaveButton: {
        variant: "secondary",
        css: css`
            width: 100%;
            margin-top: 10px;
        `,
    },
};

const WishListCard: React.FunctionComponent<Props> = ({
    language,
    allowEditingOfWishLists,
    extendedStyles,
    wishList,
    addWishListToCart,
    deleteWishList,
    leaveWishList,
}: Props) => {
    const toasterContext = useContext(ToasterContext);

    const clickAddToCartHandler = (e: any) => {
        e.preventDefault();

        function onAddAllToCartSuccess() {
            toasterContext.addToast({ body: translate("List added to cart"), messageType: "success" });
        }

        addWishListToCart({ apiParameter: { wishListId: wishList.id }, onSuccess: onAddAllToCartSuccess });
    };

    const updatedOnDisplay = getLocalizedDateTime({
        dateTime: new Date(wishList.updatedOn),
        language,
        options: {
            year: "numeric", month: "numeric", day: "numeric",
        },
    });
    let lastUpdatedDisplay = `${translate("Updated")} ${updatedOnDisplay}`;
    if (wishList.updatedByDisplayName) {
        lastUpdatedDisplay += ` ${translate("by")} ${wishList.updatedByDisplayName}`;
    }

    const canAddToCart = wishList.canAddToCart && wishList.wishListLinesCount && wishList.wishListLinesCount > 0;

    const [styles] = React.useState(() => mergeToNew(wishListCardStyles, extendedStyles));

    return (
        <GridContainer {...styles.gridContainer} data-test-selector="wishListCard">
            <GridItem {...styles.wishListInfoGridItem}>
                <GridContainer {...styles.wishListInfoGridContainer}>
                    <GridItem {...styles.basicInfoGridItem}>
                        <GridContainer {...styles.basicInfoGridContainer}>
                            <GridItem {...styles.detailLinkGridItem}>
                                <MyListsDetailsPageTypeLink title={wishList.name} wishListId={wishList.id} testSelector="wishListCardName" />
                            </GridItem>
                            {wishList.description
                                && <GridItem {...styles.descriptionGridItem}>
                                    <Typography {...styles.descriptionText} data-test-selector="wishListCardDescription">{wishList.description}</Typography>
                                </GridItem>}
                            <GridItem {...styles.lastUpdatedGridItem}>
                                <Typography {...styles.lastUpdatedText} data-test-selector="wishListCardLastUpdated">{lastUpdatedDisplay}</Typography>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.extendedInfoGridItem}>
                        <GridContainer {...styles.extendedInfoGridContainer}>
                            <GridItem {...styles.productImagesGridItem}>
                                {wishList.wishListLineCollection && wishList.wishListLineCollection.length > 0 && wishList.wishListLineCollection.slice(0, 3).map(line => (
                                    <Link key={line.id.toString()} {...styles.productImageLink} href={line.productUri}>
                                        <LazyImage {...styles.productImage} src={line.smallImagePath} altText={line.altText} />
                                    </Link>
                                ))}
                            </GridItem>
                            <GridItem {...styles.sharingStatusGridItem}>
                                <WishListSharingStatus extendedStyles={styles.sharingStatus}
                                    wishList={wishList} />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </GridItem>
            <GridItem {...styles.actionGridItem}>
                <Hidden above="sm">
                    <OverflowMenu position="end" {...styles.actionOverflowMenu}>
                        <Clickable {...styles.actionAddToCartClickable} disabled={!canAddToCart} onClick={clickAddToCartHandler}>{translate("Add List to Cart")}</Clickable>
                        {allowEditingOfWishLists && !wishList.isSharedList
                            && <Clickable {...styles.actionDeleteClickable} onClick={() => deleteWishList && deleteWishList()}>{translate("Delete")}</Clickable>
                        }
                        {allowEditingOfWishLists && wishList.isSharedList && wishList.shareOption !== ShareOptions.AllCustomerUsers
                            && <Clickable {...styles.actionLeaveClickable} onClick={() => leaveWishList && leaveWishList()}>{translate("Leave List")}</Clickable>
                        }
                    </OverflowMenu>
                </Hidden>
                <Hidden {...styles.actionGridMediumHidden} below="md">
                    <Button
                        {...styles.actionAddToCartButton}
                        disabled={!canAddToCart}
                        data-test-selector={`wishListAddToCartButton_${wishList.id}`}
                        onClick={clickAddToCartHandler}>
                        {translate("Add List to Cart")}
                    </Button>
                    {allowEditingOfWishLists && !wishList.isSharedList
                        && <Button
                            {...styles.actionDeleteButton}
                            onClick={() => deleteWishList && deleteWishList()}
                            data-test-selector={`wishListCardDeleteButton_${wishList.id}`}>
                            {translate("Delete")}
                        </Button>
                    }
                    {allowEditingOfWishLists && wishList.isSharedList && wishList.shareOption !== ShareOptions.AllCustomerUsers
                        && <Button
                            {...styles.actionLeaveButton}
                            onClick={() => leaveWishList && leaveWishList()}
                            data-test-selector={`wishListCardLeaveButton_${wishList.id}`}>
                            {translate("Leave List")}
                        </Button>
                    }
                </Hidden>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps)(WishListCard);
