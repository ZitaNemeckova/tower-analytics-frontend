import React, { useEffect, useCallback } from 'react';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useRequest from '../../Utilities/useRequest';

import Pagination from '../../Components/Pagination';

import { readJobExplorer, readJobExplorerOptions } from '../../Api/';
import { jobExplorer } from '../../Utilities/constants';

import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import { Card, CardBody, PaginationVariant } from '@patternfly/react-core';

import JobExplorerList from './JobExplorerList';
import FilterableToolbar from '../../Components/Toolbar/';
import { getQSConfig } from '../../Utilities/qs';
import ApiStatusWrapper from '../../Components/ApiStatus/ApiStatusWrapper';
import ApiOptionsWrapper from '../../Components/ApiStatus/ApiOptionsWrapper';

const initialQueryParams = {
  ...jobExplorer.defaultParams,
  attributes: jobExplorer.attributes,
};
const qsConfig = getQSConfig('job-explorer', { ...initialQueryParams }, [
  'limit',
  'offset',
]);

const JobExplorer = () => {
  const {
    queryParams,
    setFromPagination,
    setFromToolbar,
    dispatch: queryParamsDispatch,
  } = useQueryParams(qsConfig);

  const optionsApi = useRequest(
    useCallback(() => readJobExplorerOptions(queryParams), [queryParams]),
    {}
  );

  const dataApi = useRequest(
    useCallback(() => readJobExplorer(queryParams), [queryParams]),
    { items: [], meta: {} }
  );

  useEffect(() => {
    optionsApi.request();
    dataApi.request();
  }, [queryParams]);

  const renderToolbar = () => (
    <FilterableToolbar
      categories={optionsApi.result}
      filters={queryParams}
      qsConfig={qsConfig}
      setFilters={setFromToolbar}
      pagination={
        <Pagination
          count={dataApi.result?.meta?.count}
          params={{
            limit: +queryParams.limit,
            offset: +queryParams.offset,
          }}
          qsConfig={qsConfig}
          setPagination={setFromPagination}
          isCompact
        />
      }
      hasSettings
    />
  );

  const renderContent = () => (
    <ApiStatusWrapper
      api={{
        ...dataApi,
        result: dataApi.result?.items,
      }}
    >
      <JobExplorerList
        jobs={dataApi.result?.items}
        queryParams={queryParams}
        queryParamsDispatch={queryParamsDispatch}
      />
    </ApiStatusWrapper>
  );

  const renderFooter = () => (
    <Pagination
      count={dataApi.result?.meta?.count}
      params={{
        limit: +queryParams.limit,
        offset: +queryParams.offset,
      }}
      qsConfig={qsConfig}
      setPagination={setFromPagination}
      variant={PaginationVariant.bottom}
    />
  );

  return (
    <>
      <PageHeader>
        <PageHeaderTitle title={'Job Explorer'} />
      </PageHeader>
      <Main>
        <ApiOptionsWrapper api={optionsApi}>
          <Card>
            <CardBody>
              {renderToolbar()}
              {renderContent()}
              {renderFooter()}
            </CardBody>
          </Card>
        </ApiOptionsWrapper>
      </Main>
    </>
  );
};

export default JobExplorer;
