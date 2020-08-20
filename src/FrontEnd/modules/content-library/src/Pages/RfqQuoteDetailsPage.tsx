import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import loadQuoteIfNeeded from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/LoadQuoteIfNeeded";
import setExpirationDate from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/SetExpirationDate";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import React, { FC, useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const { search } = getLocation(state);
    const parsedQuery = parseQueryString<{ quoteId?: string }>(search);
    const quoteId = parsedQuery.quoteId;
    return {
        quoteId,
        quoteState: getQuoteState(state, quoteId),
    };
};

const mapDispatchToProps = {
    loadQuoteIfNeeded,
    setExpirationDate,
};

type Props = PageProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const RfqQuoteDetailsPage: FC<Props> = ({
    id,
    quoteId,
    quoteState,
    loadQuoteIfNeeded,
    setExpirationDate,
}) => {
    useEffect(() => {
        if (quoteId && !quoteState.isLoading) {
            loadQuoteIfNeeded({ quoteId });
        }
    }, [quoteId, quoteState.isLoading, quoteState.value]);

    useEffect(() => {
        setExpirationDate({ expirationDate: undefined });
    }, []);

    return (
        <Page>
            <Zone contentId={id} zoneName="Content" />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqQuoteDetailsPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const RfqQuoteDetailsPageContext = "RfqQuoteDetailsPage";
