import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import acceptJobQuote from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/AcceptJobQuote";
import declineQuote from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/DeclineQuote";
import deleteQuote from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/DeleteQuote";
import submitQuote from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/SubmitQuote";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
import { RfqQuoteDetailsPageContext } from "@insite/content-library/Pages/RfqQuoteDetailsPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu/OverflowMenu";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqQuoteDetails.quoteId),
    rfqMyQuotesPageUrl: getPageLinkByPageType(state, "RfqMyQuotesPage")?.url,
    checkoutShippingPageUrl: getPageLinkByPageType(state, "CheckoutShippingPage")?.url,
});

const mapDispatchToProps = {
    deleteQuote,
    submitQuote,
    declineQuote,
    acceptJobQuote,
};

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqQuoteDetailsHeaderStyles {
    headerGridContainer?: GridContainerProps;
    buttonsHiddenContainer?: HiddenProps;
    menuHiddenContainer?: HiddenProps;
    narrowOverflowMenu?: OverflowMenuProps;
    title: TypographyProps;
    titleGridItem: GridItemProps;
    deleteQuoteButton?: ButtonPresentationProps;
    submitQuoteButton?: ButtonPresentationProps;
    declineQuoteButton?: ButtonPresentationProps;
    acceptQuoteButton?: ButtonPresentationProps;
    generateOrderButton?: ButtonPresentationProps;
    printButton?: ButtonPresentationProps;
    buttonGridItem?: GridItemProps;
    printClickable?: ClickableProps;
    deleteQuoteClickable?: ClickableProps;
    submitQuoteClickable?: ClickableProps;
    declineQuoteClickable?: ClickableProps;
    acceptQuoteClickable?: ClickableProps;
    generateOrderClickable?: ClickableProps;
    deleteQuoteModal?: TwoButtonModalStyles;
}

const styles: RfqQuoteDetailsHeaderStyles = {
    headerGridContainer: {
        gap: 10,
    },
    deleteQuoteButton: {
        css: css` margin-left: 10px; `,
    },
    submitQuoteButton: {
        css: css` margin-left: 10px; `,
    },
    declineQuoteButton: {
        css: css` margin-left: 10px; `,
    },
    acceptQuoteButton: {
        css: css` margin-left: 10px; `,
    },
    generateOrderButton: {
        css: css` margin-left: 10px; `,
    },
    printButton: {
        buttonType: "outline",
        variant: "secondary",
    },
    buttonGridItem: {
        css: css` justify-content: flex-end; `,
        width: [2, 2, 2, 7, 6],
    },
    titleGridItem: {
        width: [10, 10, 10, 5, 6],
    },
    title: {
        variant: "h3",
        as: "h1",
        css: css` @media print { font-size: 11px; } `,
    },
    buttonsHiddenContainer: {
        below: "lg",
    },
    menuHiddenContainer: {
        above: "md",
    },
};

export const headerStyles = styles;

const RfqQuoteDetailsHeader: React.FC<Props> = ({
    quoteState,
    history,
    rfqMyQuotesPageUrl,
    checkoutShippingPageUrl,
    deleteQuote,
    submitQuote,
    declineQuote,
    acceptJobQuote,
}) => {
    const toasterContext = React.useContext(ToasterContext);
    const [deleteQuoteModalIsOpen, setDeleteQuoteModalIsOpen] = React.useState(false);

    if (!quoteState.value) {
        return null;
    }

    const quote = quoteState.value;

    const deleteQuoteClickHandler = () => {
        setDeleteQuoteModalIsOpen(true);
    };

    const submitDeleteQuoteHandler = () => {
        deleteQuote({
            quoteId: quote.id,
            onSuccess: () => {
                toasterContext.addToast({ body: "Quote deleted", messageType: "success" });
                redirectToMyQuotes();
            },
        });
    };

    const cancelDeleteQuoteHandler = () => {
        setDeleteQuoteModalIsOpen(false);
    };

    const submitQuoteClickHandler = () => {
        submitQuote({
            quote,
            onSuccess: () => {
                toasterContext.addToast({ body: "Quote submitted", messageType: "success" });
                redirectToMyQuotes();
            },
        });
    };

    const declineQuoteClickHandler = () => {
        declineQuote({
            quote,
            onSuccess: () => {
                toasterContext.addToast({ body: "Quote declined", messageType: "success" });
                redirectToMyQuotes();
            },
        });
    };

    const acceptQuoteClickHandler = () => {
        if (quote.isJobQuote) {
            acceptJobQuote({
                quote,
                onSuccess: () => {
                    toasterContext.addToast({ body: "Quote accepted", messageType: "success" });
                },
            });
        } else {
            redirectToCheckout();
        }
    };

    const generateOrderClickHandler = () => {
        // TODO ISC-11796 Update quantities before redirect to checkout
        redirectToCheckout();
    };

    const redirectToMyQuotes = () => {
        if (rfqMyQuotesPageUrl) {
            history.push(rfqMyQuotesPageUrl);
        }
    };

    const redirectToCheckout = () => {
        if (checkoutShippingPageUrl) {
            history.push(`${checkoutShippingPageUrl}?cartId=${quote.id}`);
        }
    };

    const expirationDateIsGreaterThanCurrentDate = () => {
        if (!quote || !quote.expirationDate) {
            return true;
        }

        const expirationDate = new Date(quote.expirationDate.toString());
        const currentDate = new Date();

        expirationDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        return expirationDate >= currentDate;
    };

    const quoteType = quote.isJobQuote ? "Job Quote" : "Sales Quote";
    const printLabel = translate("Print");
    const deleteQuoteLabel = translate(`Delete ${quoteType}`);
    const submitQuoteLabel = translate(`Submit ${quoteType}`);
    const declineQuoteLabel = translate(`Decline ${quoteType}`);
    const acceptQuoteLabel = translate(`Accept ${quoteType}`);
    const generateOrderLabel = translate("Generate Order");
    const canBeSubmittedOrDeleted = quote.isSalesperson && quote.isEditable;
    const expirationDateIsValid = expirationDateIsGreaterThanCurrentDate();
    const canBeDeclined = !quote.isSalesperson && quote.status === "QuoteProposed" && expirationDateIsValid;
    const canBeAccepted = !quote.isSalesperson && (quote.status === "QuoteProposed" || quote.status === "AwaitingApproval") && expirationDateIsValid;
    const canGenerateOrder = !quote.isSalesperson && quote.isJobQuote && quote.status === "JobAccepted";

    return (<>
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.title}>
                    {`${translate(quoteType)} ${quote.quoteNumber}`}
                </Typography>
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <Hidden {...styles.menuHiddenContainer}>
                    <OverflowMenu  {...styles.narrowOverflowMenu}>
                        <Clickable {...styles.printClickable} onClick={openPrintDialog}>{printLabel}</Clickable>
                        {canBeSubmittedOrDeleted
                            && <>
                                <Clickable {...styles.deleteQuoteClickable} onClick={deleteQuoteClickHandler}>{deleteQuoteLabel}</Clickable>
                                <Clickable {...styles.submitQuoteClickable} onClick={submitQuoteClickHandler}>{submitQuoteLabel}</Clickable>
                            </>
                        }
                        {canBeDeclined
                            && <Clickable {...styles.declineQuoteClickable} onClick={declineQuoteClickHandler}>{declineQuoteLabel}</Clickable>
                        }
                        {canBeAccepted
                            && <Clickable {...styles.acceptQuoteClickable} onClick={acceptQuoteClickHandler}>{acceptQuoteLabel}</Clickable>
                        }
                        {canGenerateOrder
                            && <Clickable {...styles.generateOrderClickable} onClick={generateOrderClickHandler}>{generateOrderLabel}</Clickable>
                        }
                    </OverflowMenu>
                </Hidden>
                <Hidden {...styles.buttonsHiddenContainer}>
                    <Button {...styles.printButton} onClick={openPrintDialog}>{printLabel}</Button>
                    {canBeSubmittedOrDeleted
                        && <>
                            <Button {...styles.deleteQuoteButton} onClick={deleteQuoteClickHandler}>{deleteQuoteLabel}</Button>
                            <Button {...styles.submitQuoteButton} onClick={submitQuoteClickHandler}>{submitQuoteLabel}</Button>
                        </>
                    }
                    {canBeDeclined
                        && <Button {...styles.declineQuoteButton} onClick={declineQuoteClickHandler}>{declineQuoteLabel}</Button>
                    }
                    {canBeAccepted
                        && <Button {...styles.acceptQuoteButton} onClick={acceptQuoteClickHandler}>{acceptQuoteLabel}</Button>
                    }
                    {canGenerateOrder
                        && <Button {...styles.generateOrderButton} onClick={generateOrderClickHandler}>{generateOrderLabel}</Button>
                    }
                </Hidden>
            </GridItem>
        </GridContainer>
        <TwoButtonModal
            {...styles.deleteQuoteModal}
            modalIsOpen={deleteQuoteModalIsOpen}
            headlineText={translate("Delete Quote")}
            messageText={siteMessage("Rfq_DeleteQuoteConfirmation")}
            cancelButtonText={translate("Cancel")}
            submitButtonText={translate("Delete")}
            onCancel={cancelDeleteQuoteHandler}
            onSubmit={submitDeleteQuoteHandler}
            submitTestSelector="submitDeleteQuote"
        />
    </>);
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(RfqQuoteDetailsHeader)),
    definition: {
        displayName: "Page Header",
        allowedContexts: [RfqQuoteDetailsPageContext],
        fieldDefinitions: [],
        group: "RFQ Quote Details",
    },
};

export default widgetModule;