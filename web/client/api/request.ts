import {
  GetDBGPTsListResponse,
  PostAgentHubUpdateParams,
  PostAgentMyPluginResponse,
  PostAgentPluginResponse,
  PostAgentQueryParams,
  PostDbgptMyQueryParams,
} from '@/types/agent';
import { GetAppInfoParams, IApp } from '@/types/app';
import {
  ChatHistoryResponse,
  DialogueListResponse,
  FeedBack,
  IChatDialogueSchema,
  IDB,
  NewDialogueParam,
  SceneResponse,
  UserParam,
  UserParamResponse,
} from '@/types/chat';
import {
  ChatFeedBackSchema,
  DbListResponse,
  DbSupportTypeResponse,
  PostDbParams,
  PostDbRefreshParams,
} from '@/types/db';
import {
  GetEditorSQLRoundRequest,
  GetEditorySqlParams,
  PostEditorChartRunParams,
  PostEditorChartRunResponse,
  PostEditorSQLRunParams,
  PostSQLEditorSubmitParams,
} from '@/types/editor';
import {
  AddKnowledgeParams,
  ArgumentsParams,
  ChunkListParams,
  DocumentParams,
  GraphVisResult,
  IArguments,
  IChunkList,
  IChunkStrategyResponse,
  IDocumentResponse,
  IRetrieveStrategy,
  ISpace,
  ISyncBatchParameter,
  ISyncBatchResponse,
  SpaceConfig,
} from '@/types/knowledge';
import { BaseModelParams, IModelData, StartModelParams, SupportModel } from '@/types/model';
import { AxiosRequestConfig } from 'axios';
import { DELETE, GET, POST, PUT } from '.';

/** App */
export const postScenes = () => {
  return POST<null, Array<SceneResponse>>('/api/v1/chat/dialogue/scenes');
};
export const newDialogue = (data: NewDialogueParam) => {
  return POST<NewDialogueParam, IChatDialogueSchema>(
    `/api/v1/chat/dialogue/new?chat_mode=${data.chat_mode}&model_name=${data.model}`,
    data,
  );
};

const buildUrl = (baseUrl: string, params: any) => {
  const queryString = Object.keys(params)
    .filter(key => params[key] !== undefined) //
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const addUser = (data: UserParam) => {
  return POST<UserParam, UserParamResponse>('/api/v1/user/add', data);
};

/** Database Page */
export const getDbList = () => {
  return GET<null, DbListResponse>('/api/v2/serve/datasources');
};
export const getDbSupportType = () => {
  return GET<null, DbSupportTypeResponse>('/api/v2/serve/datasource-types');
};
export const postDbDelete = (id: string) => {
  return DELETE(`/api/v2/serve/datasources/${id}`);
};
export const postDbEdit = (data: PostDbParams) => {
  return PUT<PostDbParams, null>('/api/v2/serve/datasources', data);
};
export const postDbAdd = (data: PostDbParams) => {
  return POST<PostDbParams, null>('/api/v2/serve/datasources', data);
};
export const postDbTestConnect = (data: PostDbParams) => {
  return POST<PostDbParams, null>('/api/v2/serve/datasources/test-connection', data);
};
export const postDbRefresh = (data: PostDbRefreshParams) => {
  return POST<PostDbRefreshParams, boolean>(`/api/v2/serve/datasources/${data.id}/refresh`);
};

/** Chat Page */
export const getDialogueList = () => {
  return GET<null, DialogueListResponse>('/api/v1/chat/dialogue/list');
};
export const getUsableModels = () => {
  return GET<null, Array<string>>('/api/v1/model/types');
};
export const postChatModeParamsList = (chatMode: string) => {
  return POST<null, IDB[]>(`/api/v1/chat/mode/params/list?chat_mode=${chatMode}`);
};
export const postChatModeParamsInfoList = (chatMode: string) => {
  return POST<null, Record<string, string>>(`/api/v1/chat/mode/params/info?chat_mode=${chatMode}`);
};
export const getChatHistory = (convId: string) => {
  return GET<null, ChatHistoryResponse>(`/api/v1/chat/dialogue/messages/history?con_uid=${convId}`);
};
export const postChatModeParamsFileLoad = ({
  convUid,
  chatMode,
  data,
  config,
  model,
  temperatureValue,
  maxNewTokensValue,
  userName,
  sysCode,
}: {
  convUid: string;
  chatMode: string;
  data: FormData;
  model: string;
  temperatureValue?: number;
  maxNewTokensValue?: number;
  userName?: string;
  sysCode?: string;
  config?: Omit<AxiosRequestConfig, 'headers'>;
}) => {
  const baseUrl = `/api/v1/resource/file/upload`;
  const params = {
    conv_uid: convUid,
    chat_mode: chatMode,
    model_name: model,
    user_name: userName,
    sys_code: sysCode,
    temperature: temperatureValue,
    max_new_tokens: maxNewTokensValue,
  };

  const url = buildUrl(baseUrl, params);
  return POST<FormData, any>(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
};

export const clearChatHistory = (conUid: string) => {
  return POST<null, Record<string, string>>(`/api/v1/chat/dialogue/clear?con_uid=${conUid}`);
};

/** Menu */
export const delDialogue = (conv_uid: string) => {
  return POST(`/api/v1/chat/dialogue/delete?con_uid=${conv_uid}`);
};

/** Editor */
export const getEditorSqlRounds = (id: string) => {
  return GET<null, GetEditorSQLRoundRequest>(`/api/v1/editor/sql/rounds?con_uid=${id}`);
};
export const postEditorSqlRun = (data: PostEditorSQLRunParams) => {
  return POST<PostEditorSQLRunParams>(`/api/v1/editor/sql/run`, data);
};
export const postEditorChartRun = (data: PostEditorChartRunParams) => {
  return POST<PostEditorChartRunParams, PostEditorChartRunResponse>(`/api/v1/editor/chart/run`, data);
};
export const postSqlEditorSubmit = (data: PostSQLEditorSubmitParams) => {
  return POST<PostSQLEditorSubmitParams>(`/api/v1/sql/editor/submit`, data);
};
export const getEditorSql = (id: string, round: string | number) => {
  return POST<GetEditorySqlParams, string | Array<any>>('/api/v1/editor/sql', {
    con_uid: id,
    round,
  });
};

/** knowledge */
export const getArguments = (knowledgeName: string) => {
  return POST<any, IArguments>(`/knowledge/${knowledgeName}/arguments`, {});
};
export const saveArguments = (knowledgeName: string, data: ArgumentsParams) => {
  return POST<ArgumentsParams, IArguments>(`/knowledge/${knowledgeName}/argument/save`, data);
};
export const getRetrieveStrategyList = () => {
  return POST<any, Array<IRetrieveStrategy>>(`/knowledge/retrieve_strategy_list`, {});
};

export const getSpaceList = (data?: any) => {
  return POST<any, Array<ISpace>>('/knowledge/space/list', data);
};
export const getDocumentList = (spaceName: string, data: Record<string, number | Array<number>>) => {
  return POST<Record<string, number | Array<number>>, IDocumentResponse>(`/knowledge/${spaceName}/document/list`, data);
};
export const getGraphVis = (spaceName: string, data: { limit: number }) => {
  return POST<Record<string, number>, GraphVisResult>(`/knowledge/${spaceName}/graphvis`, data);
};

export const addDocument = (knowledgeName: string, data: DocumentParams) => {
  return POST<DocumentParams, number>(`/knowledge/${knowledgeName}/document/add`, data);
};

export const addSpace = (data: AddKnowledgeParams) => {
  return POST<AddKnowledgeParams, number>(`/knowledge/space/add`, data);
};

export const getChunkStrategies = () => {
  return GET<null, Array<IChunkStrategyResponse>>('/knowledge/document/chunkstrategies');
};

export const syncDocument = (spaceName: string, data: Record<string, Array<number>>) => {
  return POST<Record<string, Array<number>>, string | null>(`/knowledge/${spaceName}/document/sync`, data);
};

export const syncBatchDocument = (spaceName: string, data: Array<ISyncBatchParameter>) => {
  return POST<Array<ISyncBatchParameter>, ISyncBatchResponse>(`/knowledge/${spaceName}/document/sync_batch`, data);
};

export const uploadDocument = (knowLedgeName: string, data: FormData) => {
  return POST<FormData, number>(`/knowledge/${knowLedgeName}/document/upload`, data);
};

export const getChunkList = (spaceName: string, data: ChunkListParams) => {
  return POST<ChunkListParams, IChunkList>(`/knowledge/${spaceName}/chunk/list`, data);
};

export const delDocument = (spaceName: string, data: Record<string, number>) => {
  return POST<Record<string, number>, null>(`/knowledge/${spaceName}/document/delete`, data);
};

export const delSpace = (data: Record<string, string>) => {
  return POST<Record<string, string>, null>(`/knowledge/space/delete`, data);
};

/** models */
export const getModelList = () => {
  return GET<null, Array<IModelData>>('/api/v2/serve/model/models');
};

// Create and deploy a new model
export const createModel = (data: StartModelParams) => {
  return POST<StartModelParams, boolean>('/api/v2/serve/model/models', data);
};

// Stop the running model
export const stopModel = (data: BaseModelParams) => {
  return POST<BaseModelParams, boolean>('/api/v2/serve/model/models/stop', data);
};

// Start the stopped model
export const startModel = (data: BaseModelParams) => {
  return POST<BaseModelParams, boolean>('/api/v2/serve/model/models/start', data);
};

export const getSupportModels = () => {
  return GET<null, Array<SupportModel>>('/api/v2/serve/model/model-types');
};

/** Agent */
export const postAgentQuery = (data: PostAgentQueryParams) => {
  return POST<PostAgentQueryParams, PostAgentPluginResponse>('/api/v1/agent/query', data);
};
export const postDbgptsQuery = (data: PostAgentQueryParams) => {
  return POST<PostAgentQueryParams, PostAgentPluginResponse>(
    `/api/v1/serve/dbgpts/hub/query_page?page=${data?.page_index}&page_size=${data?.page_size}`,
    data,
  );
};
export const postAgentHubUpdate = (data?: PostAgentHubUpdateParams) => {
  return POST<PostAgentHubUpdateParams>(
    '/api/v1/agent/hub/update',
    data ?? { channel: '', url: '', branch: '', authorization: '' },
  );
};
export const postDbgptsHubUpdate = (data?: PostAgentHubUpdateParams) => {
  return POST<PostAgentHubUpdateParams>(
    '/api/v1/serve/dbgpts/hub/source/refresh',
    data ?? { channel: '', url: '', branch: '', authorization: '' },
  );
};
export const postAgentMy = (user?: string) => {
  return POST<undefined, PostAgentMyPluginResponse>('/api/v1/agent/my', undefined, { params: { user } });
};
export const postDbgptsMy = (data?: PostDbgptMyQueryParams) => {
  return POST<PostDbgptMyQueryParams, PostAgentMyPluginResponse>(
    `/api/v1/serve/dbgpts/my/query_page?page=${data?.page_index}&page_size=${data?.page_size}`,
    data,
  );
};
export const postAgentInstall = (pluginName: string, user?: string) => {
  return POST('/api/v1/agent/install', undefined, {
    params: { plugin_name: pluginName, user },
    timeout: 60000,
  });
};
export const postDbgptsInstall = (data: object, user?: string) => {
  return POST('/api/v1/serve/dbgpts/hub/install', data, {
    params: { user },
    timeout: 60000,
  });
};
export const postAgentUninstall = (pluginName: string, user?: string) => {
  return POST('/api/v1/agent/uninstall', undefined, {
    params: { plugin_name: pluginName, user },
    timeout: 60000,
  });
};
export const postDbgptsUninstall = (data: { name: string; type: string }, user?: string) => {
  return POST('/api/v1/serve/dbgpts/my/uninstall', undefined, {
    params: { ...data, user },
    timeout: 60000,
  });
};
export const postAgentUpload = (user = '', data: FormData, config?: Omit<AxiosRequestConfig, 'headers'>) => {
  return POST<FormData>('/api/v1/personal/agent/upload', data, {
    params: { user },
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
};
export const getDbgptsList = () => {
  return GET<undefined, GetDBGPTsListResponse>('/api/v1/dbgpts/list');
};

/** chat feedback **/
export const getChatFeedBackSelect = () => {
  return GET<null, FeedBack>(`/api/v1/feedback/select`, undefined);
};
export const getChatFeedBackItme = (conv_uid: string, conv_index: number) => {
  return GET<null, Record<string, string>>(
    `/api/v1/feedback/find?conv_uid=${conv_uid}&conv_index=${conv_index}`,
    undefined,
  );
};
export const postChatFeedBackForm = ({
  data,
  config,
}: {
  data: ChatFeedBackSchema;
  config?: Omit<AxiosRequestConfig, 'headers'>;
}) => {
  return POST<ChatFeedBackSchema, any>(`/api/v1/feedback/commit`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
};

/** prompt */

/** app */

export const collectApp = (data: Record<string, string>) => {
  return POST<Record<string, string>, []>('/api/v1/app/collect', data);
};

export const unCollectApp = (data: Record<string, string>) => {
  return POST<Record<string, string>, []>('/api/v1/app/uncollect', data);
};

export const getResourceType = () => {
  return GET<null, string[]>('/api/v1/resource-type/list');
};

export const publishApp = (app_code: string) => {
  return POST<Record<string, any>, []>('/api/v1/app/publish', { app_code });
};

export const unPublishApp = (app_code: string) => {
  return POST<Record<string, any>, []>('/api/v1/app/unpublish', { app_code });
};
export const addOmcDB = (params: Record<string, string>) => {
  return POST<Record<string, any>, []>('/api/v1/chat/db/add', params);
  // return POST<Record<string, any>, []>('/api/v2/serve/datasources', params);
};

export const getAppInfo = (data: GetAppInfoParams) => {
  return GET<GetAppInfoParams, IApp>('/api/v1/app/info', data);
};

export const getSupportDBList = (db_name = '') => {
  return GET<null, Record<string, any>>(`/api/v1/permission/db/list?db_name=${db_name}`);
};

export const recommendApps = (data: Record<string, string>) => {
  return POST<Record<string, string>, []>('/api/v1/app/hot/list', data);
};
export const flowSearch = (data: Record<string, string>) => {
  return POST<Record<string, string>, []>('/api/v1/serve/awel/flows', data);
};
export const modelSearch = (data: Record<string, string>) => {
  return POST<Record<string, string>, []>('/api/controller/models', data);
};

export const getKnowledgeAdmins = (spaceId: string) => {
  return GET<string, Record<string, any>>(`/knowledge/users/list?space_id=${spaceId}`);
};
export const updateKnowledgeAdmins = (data: Record<string, string>) => {
  return POST<Record<string, any>, any[]>(`/knowledge/users/update`, data);
};

/** AWEL Flow */

/** app */
export const delApp = (data: Record<string, string>) => {
  return POST<Record<string, string>, []>('/api/v1/app/remove', data);
};

export const getSpaceConfig = () => {
  return GET<string, SpaceConfig>(`/knowledge/space/config`);
};
