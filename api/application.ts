import { queryClient } from "@/app/_layout";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { coolifyFetch, optimisticUpdate, optimisticUpdateMany } from "./client";
import {
  Application,
  ApplicationActionResponse,
  ApplicationEnv,
  ApplicationLogs,
  CoolifyApplications,
  CreateApplicationBodyRequired,
  CreateApplicationEnvBody,
  CreateApplicationEnvResponse,
  CreateApplicationUrl,
  UpdateApplicationBody,
} from "./types/application.types";
import {
  ResourceActionResponse,
  ResourceCreateResponse,
} from "./types/resources.types";

// Hook return types
export type UseStartApplication = (
  uuid: string,
  options?: UseMutationOptions<
    ApplicationActionResponse,
    Error,
    { force?: boolean; instant_deploy?: boolean }
  >
) => UseMutationResult<
  ApplicationActionResponse,
  Error,
  { force?: boolean; instant_deploy?: boolean }
>;

export type UseStopApplication = (
  uuid: string,
  options?: UseMutationOptions<ResourceActionResponse, Error, void>
) => UseMutationResult<ResourceActionResponse, Error, void>;

export type UseRestartApplication = (
  uuid: string,
  options?: UseMutationOptions<ApplicationActionResponse, Error, void>
) => UseMutationResult<ApplicationActionResponse, Error, void>;

export type UseUpdateApplication = (
  uuid: string,
  options?: UseMutationOptions<
    ResourceActionResponse,
    Error,
    UpdateApplicationBody
  >
) => UseMutationResult<ResourceActionResponse, Error, UpdateApplicationBody>;

// Query keys
export const ApplicationKeys = {
  all: ["applications"],
  queries: {
    all: () => ApplicationKeys.all,
    single: (uuid: string) => [...ApplicationKeys.all, uuid],
    logs: (uuid: string, lines: number) => [
      ...ApplicationKeys.queries.single(uuid),
      "logs",
      lines,
    ],
    envs: (uuid: string) => [...ApplicationKeys.queries.single(uuid), "envs"],
  },
  mutations: {
    create: () => [...ApplicationKeys.all, "create"],
    start: (uuid: string) => [...ApplicationKeys.queries.single(uuid), "start"],
    stop: (uuid: string) => [...ApplicationKeys.queries.single(uuid), "stop"],
    restart: (uuid: string) => [
      ...ApplicationKeys.queries.single(uuid),
      "restart",
    ],
    update: (uuid: string) => [
      ...ApplicationKeys.queries.single(uuid),
      "update",
    ],
    createEnv: (uuid: string) => [
      ...ApplicationKeys.queries.envs(uuid),
      "create",
    ],
  },
};

// Fetch functions
export const getApplications = async () => {
  const applications = await coolifyFetch<Application[]>("/applications");

  applications.forEach((application) => {
    queryClient.setQueryData(
      ApplicationKeys.queries.single(application.uuid),
      application
    );
  });

  return applications;
};

export const getApplication = async (uuid: string) => {
  const data = await coolifyFetch<Application>(`/applications/${uuid}`);
  // Update the applications list cache with the new application
  optimisticUpdateMany(ApplicationKeys.all, data);
  return data;
};

export const getApplicationLogs = async (uuid: string, lines = 100) => {
  return coolifyFetch<ApplicationLogs>(
    `/applications/${uuid}/logs?lines=${lines}`
  );
};

export const getApplicationEnvs = async (uuid: string) => {
  return coolifyFetch<ApplicationEnv[]>(`/applications/${uuid}/envs`);
};

export const createApplicationEnv = async (
  uuid: string,
  body: CreateApplicationEnvBody
) => {
  const data = await coolifyFetch<CreateApplicationEnvResponse>(
    `/applications/${uuid}/envs`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }
  );

  if ("message" in data) {
    throw data;
  }

  queryClient.setQueryData(
    ApplicationKeys.queries.envs(uuid),
    (old: ApplicationEnv[]) => [...old, { ...body, uuid: data.uuid }]
  );

  return data;
};

export const startApplication = async (
  uuid: string,
  force = false,
  instant_deploy = false
) => {
  const params = new URLSearchParams({
    force: String(force),
    instant_deploy: String(instant_deploy),
  });
  return coolifyFetch<ApplicationActionResponse>(
    `/applications/${uuid}/start?${params.toString()}`,
    {
      method: "POST",
    }
  );
};

export const stopApplication = async (uuid: string) => {
  return coolifyFetch<ResourceActionResponse>(`/applications/${uuid}/stop`, {
    method: "POST",
  });
};

export const restartApplication = async (uuid: string) => {
  return coolifyFetch<ApplicationActionResponse>(
    `/applications/${uuid}/restart`,
    {
      method: "POST",
    }
  );
};

export const updateApplication = async (
  uuid: string,
  body: UpdateApplicationBody
) => {
  // Update individual application cache
  optimisticUpdate(ApplicationKeys.queries.single(uuid), body);

  // Update applications list cache
  optimisticUpdateMany(ApplicationKeys.all, { ...body, uuid });

  return coolifyFetch<ResourceActionResponse>(`/applications/${uuid}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body,
  });
};

export const createApplication = async <
  T extends CoolifyApplications,
  B extends CreateApplicationBodyRequired
>(
  body: B,
  type: T
) => {
  const res = await coolifyFetch<ResourceCreateResponse>(
    `/applications${CreateApplicationUrl[type]}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }
  );

  queryClient.prefetchQuery({
    queryKey: ApplicationKeys.queries.single(res.uuid),
    queryFn: () => getApplication(res.uuid),
  });

  return res;
};

// Query hooks
export const useApplications = (
  options?: Omit<UseQueryOptions<Application[], Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ApplicationKeys.queries.all(),
    queryFn: getApplications,
    ...options,
  });
};

export const useApplication = (
  uuid: string,
  options?: Omit<UseQueryOptions<Application, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ApplicationKeys.queries.single(uuid),
    queryFn: () => getApplication(uuid),
    ...options,
  });
};

export const useApplicationLogs = (
  uuid: string,
  lines = 100,
  options?: Omit<UseQueryOptions<ApplicationLogs, Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ApplicationKeys.queries.logs(uuid, lines),
    queryFn: () => getApplicationLogs(uuid, lines),
    ...options,
  });
};

export const useApplicationEnvs = (
  uuid: string,
  options?: Omit<UseQueryOptions<ApplicationEnv[], Error>, "queryKey">
) => {
  return useQuery({
    queryKey: ApplicationKeys.queries.envs(uuid),
    queryFn: () => getApplicationEnvs(uuid),
    ...options,
  });
};

// Mutation hooks
export const useCreateApplicationEnv = (
  uuid: string,
  options?: UseMutationOptions<
    CreateApplicationEnvResponse,
    Error,
    CreateApplicationEnvBody
  >
) => {
  return useMutation({
    mutationKey: ApplicationKeys.mutations.createEnv(uuid),
    mutationFn: (body: CreateApplicationEnvBody) =>
      createApplicationEnv(uuid, body),
    ...options,
  });
};

export const useStartApplication: UseStartApplication = (
  uuid: string,
  options
) => {
  return useMutation({
    mutationKey: ApplicationKeys.mutations.start(uuid),
    mutationFn: ({
      force = false,
      instant_deploy = false,
    }: {
      force?: boolean;
      instant_deploy?: boolean;
    }) => startApplication(uuid, force, instant_deploy),
    ...options,
  });
};

export const useStopApplication: UseStopApplication = (
  uuid: string,
  options
) => {
  return useMutation({
    mutationKey: ApplicationKeys.mutations.stop(uuid),
    mutationFn: () => stopApplication(uuid),
    ...options,
  });
};

export const useRestartApplication: UseRestartApplication = (
  uuid: string,
  options
) => {
  return useMutation({
    mutationKey: ApplicationKeys.mutations.restart(uuid),
    mutationFn: () => restartApplication(uuid),
    ...options,
  });
};

export const useUpdateApplication: UseUpdateApplication = (
  uuid: string,
  options
) => {
  return useMutation({
    mutationKey: ApplicationKeys.mutations.update(uuid),
    mutationFn: (body: UpdateApplicationBody) => updateApplication(uuid, body),
    ...options,
  });
};

export const useCreateApplication = <
  T extends CoolifyApplications,
  B extends CreateApplicationBodyRequired
>(
  options?: UseMutationOptions<
    ResourceCreateResponse,
    Error,
    { body: B; type: T }
  >
) => {
  return useMutation({
    mutationKey: ApplicationKeys.mutations.create(),
    mutationFn: ({ body, type }: { body: B; type: T }) =>
      createApplication(body, type),
    ...options,
  });
};
