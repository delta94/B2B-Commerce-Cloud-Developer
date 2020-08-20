import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import { getProductListDataViewProperty } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps extends WidgetProps {
}

const mapStateToProps = (state: ApplicationState) => ({
    pagination: getProductListDataViewProperty(state, "pagination"),
});

const mapDispatchToProps = {
    addProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const paginationStyles: ProductListPaginationStyles = {};

const styles = paginationStyles;

const ProductListPagination: FC<Props> = ({ addProductFilters, pagination }) => {
    const changePage = (newPageIndex: number) => {
        addProductFilters({ page: newPageIndex });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        addProductFilters({ pageSize: newPageSize });
    };

    if (!pagination || !pagination.totalItemCount) {
        return null;
    }

    return (
        <Pagination
            {...styles.pagination}
            resultsCount={pagination!.totalItemCount}
            currentPage={pagination!.page}
            resultsPerPage={pagination!.pageSize}
            resultsPerPageOptions={pagination!.pageSizeOptions}
            onChangePage={changePage}
            onChangeResultsPerPage={changeResultsPerPage} />
    );
};

const widgetModule: WidgetModule = {

    component: connect(mapStateToProps, mapDispatchToProps)(ProductListPagination),
    definition: {
        group: "Product List",
        displayName: "Pagination",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
