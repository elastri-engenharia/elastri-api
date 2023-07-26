/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { api } from "../../services/api";

import {
  HiUserPlus,
  HiOutlineTrash,
  HiArrowDownTray,
  HiOutlinePencilSquare,
  HiMiniMagnifyingGlass,
  HiTrash,
  HiOutlineShieldCheck,
} from "react-icons/hi2";

import Breadcrumb from "../../components/Breadcrumb";
import { Tables } from "../../components/Tables";
import {
  Role,
  User,
  roles,
  userFormData,
  userFormSchema,
} from "../../entity/User";

import { ModalsConfirmation } from "../../components/ModalConfirmation";
import { ModalsForm } from "../../components/ModalForms";
import { FormElements } from "../../components/FormElements";
import Loader from "../../common/Loader";

export default function UserLists() {
  const methods = useForm<userFormData>({
    resolver: zodResolver(userFormSchema),
  });

  const queryClient = useQueryClient();

  const [search, setSearch] = useState<string>("");
  const [idUser, setIdUser] = useState<string>("");
  const [openMConfirmTrash, setOpenMConfirmTrash] = useState<boolean>(false);
  const [openMFormsCreated, setOpenMFormsCreated] = useState<boolean>(false);
  const [openMFormsUpdated, setOpenMFormsUpdated] = useState<boolean>(false);

  const user = useQuery(["allUsers"], () =>
    api.get("/users").then((res) => res.data)
  );

  const createUser = useMutation((data) => api.post("users/create", data), {
    onSuccess: () => {
      queryClient.invalidateQueries("allUsers");
    },
  });

  const updateUser = useMutation(
    (data) => api.put(`users/${idUser}/update`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("allUsers");
      },
    }
  );

  const handleSubmitCreated = async (value: any) => {
    await createUser.mutateAsync(value);
    methods.reset();
  };

  const handleSubmitUpdated = async (value: any) => {
    await updateUser.mutateAsync(value);
    methods.reset();
  };

  if (updateUser.isLoading || createUser.isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb pageName="Listagem & Registro de Usuários" />

      <div className="flex flex-col gap-10">
        <div className="flex justify-between">
          <div className="pr-0.5">
            <label htmlFor="voice-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <HiMiniMagnifyingGlass className="h-5 w-5 text-black dark:text-white" />
              </div>
              <input
                type="search"
                id="voice-search"
                className="dark:focus:border-blue-500 block w-full rounded-lg border border-meta-4 bg-gray p-2.5 pl-10 text-sm text-black  focus:ring-secondary dark:border-white dark:bg-meta-4 dark:text-white dark:placeholder-white dark:focus:ring-white"
                placeholder="Busque Usuários..."
                required
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="">
              <button
                className="border-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2 inline-flex items-center rounded-lg border bg-primary px-3 py-2.5 text-sm font-medium text-white hover:bg-primary focus:outline-none focus:ring-4"
                onClick={() => {
                  setOpenMFormsCreated(true);
                }}
              >
                <HiUserPlus className="h-7 w-7 pr-2 font-medium text-white" />
                Novo Usuário
              </button>
            </div>
          </div>
        </div>

        <Tables.Root>
          <Tables.THead>
            <Tables.THContent
              item="Username"
              className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11"
            />
            <Tables.THContent item="Email" className="min-w-[250px]" />
            <Tables.THContent
              item="Password"
              className="min-w-[120px] max-w-[250px]"
            />
            <Tables.THContent
              item="Permissão de Acesso"
              className="min-w-[180px]"
            />
            <Tables.THContent item="Ações" />
          </Tables.THead>
          {user.data?.users
            .filter((item: User) => {
              return search.toLowerCase() === ""
                ? item
                : item.username.toLowerCase().includes(search) ||
                    item.email.toLowerCase().includes(search) ||
                    item.role.toLocaleLowerCase().includes(search);
            })
            .map((item: User, index: number) => (
              <Tables.TBody key={index}>
                <Tables.TBContent
                  item={item.username}
                  className="pl-9 xl:pl-11"
                />
                <Tables.TBContent item={item.email} />
                <Tables.TBContent item={item.password} />
                <Tables.TBContent item={item.role} />
                <Tables.TActions>
                  <Tables.TAction
                    icon={HiOutlinePencilSquare}
                    onClick={() => {
                      setOpenMFormsUpdated(true);
                      methods.setValue("username", item.username);
                      methods.setValue("email", item.email);
                      methods.setValue("password", item.password);
                      methods.setValue("role", item.role);
                      setIdUser(item.id_user);
                    }}
                  />
                  <Tables.TAction
                    icon={HiOutlineTrash}
                    onClick={() => setOpenMConfirmTrash(true)}
                  />
                  <Tables.TAction icon={HiArrowDownTray} />
                </Tables.TActions>
              </Tables.TBody>
            ))}
        </Tables.Root>

        <ModalsConfirmation.Root isOpen={openMConfirmTrash}>
          <ModalsConfirmation.MHead icon={HiTrash} className="fill-danger">
            <ModalsConfirmation.MHContent
              title="Deseja deletar este colaborador ?"
              message="Deletar este colaborador perderá todos os dados associados a ele."
            />
          </ModalsConfirmation.MHead>
          <ModalsConfirmation.MBoby>
            <ModalsConfirmation.MBAction
              text="Voltar"
              onClick={() => setOpenMConfirmTrash(false)}
            />
            <ModalsConfirmation.MBAction
              text="CONFIRMAR"
              className="text-success dark:bg-success"
            />
          </ModalsConfirmation.MBoby>
        </ModalsConfirmation.Root>

        {/* Form for created */}
        <ModalsForm.Root isOpen={openMFormsCreated}>
          <FormElements.Root>
            <FormElements.FHeader title="Create Users" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitCreated)}
              >
                <FormElements.FContainer>
                  <FormElements.FLabels title="Username" symbol="*" />
                  <FormElements.FInputs
                    type="text"
                    isResponseError={createUser.isError}
                    responseError={createUser.error}
                    registers="username"
                    placeholder="Insira seu Username"
                  />
                </FormElements.FContainer>

                <FormElements.FContainer>
                  <FormElements.FLabels title="Email" symbol="*" />
                  <FormElements.FInputs
                    type="email"
                    isResponseError={createUser.isError}
                    responseError={createUser.error}
                    registers="email"
                    placeholder="Insira um email"
                  />
                </FormElements.FContainer>

                <FormElements.FContainer>
                  <FormElements.FLabels title="Password" symbol="*" />
                  <FormElements.FInputs
                    type="password"
                    isResponseError={createUser.isError}
                    responseError={createUser.error}
                    registers="password"
                    placeholder="Insira uma senha"
                  />
                </FormElements.FContainer>

                <FormElements.FContainer>
                  <FormElements.FLabels
                    title="Permissão de Acesso"
                    symbol="*"
                  />
                  <FormElements.FSelectSimpleContainer
                    registers="role"
                    icon={HiOutlineShieldCheck}
                  >
                    {roles.map((item: Role, index: number) => (
                      <FormElements.FSelectSimpleOption
                        placeholder="Selecione uma permissão..."
                        text={item.value}
                      />
                    ))}
                  </FormElements.FSelectSimpleContainer>
                </FormElements.FContainer>

                {/* Start Actions */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FAction
                    title="Voltar"
                    onClick={() => {
                      setOpenMFormsCreated(false);
                      methods.reset();
                    }}
                  />
                  <FormElements.FAction title="Enviar" type="submit" />
                </FormElements.FContainer>
                {/* End Actions */}
              </FormElements.FBody>
            </FormProvider>
          </FormElements.Root>
        </ModalsForm.Root>
        {/* Form for created */}

        {/* Form for updated */}
        <ModalsForm.Root isOpen={openMFormsUpdated}>
          <FormElements.Root>
            <FormElements.FHeader title="Update Users" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitUpdated)}
              >
                <FormElements.FContainer>
                  <FormElements.FLabels title="Username" symbol="*" />
                  <FormElements.FInputs
                    type="text"
                    isResponseError={updateUser.isError}
                    responseError={updateUser.error}
                    registers="username"
                    placeholder="Insira seu Username"
                  />
                </FormElements.FContainer>

                <FormElements.FContainer>
                  <FormElements.FLabels title="Email" symbol="*" />
                  <FormElements.FInputs
                    type="email"
                    isResponseError={updateUser.isError}
                    responseError={updateUser.error}
                    registers="email"
                    placeholder="Insira um email"
                  />
                </FormElements.FContainer>

                <FormElements.FContainer>
                  <FormElements.FLabels title="Password" symbol="*" />
                  <FormElements.FInputs
                    type="password"
                    isResponseError={updateUser.isError}
                    responseError={updateUser.error}
                    registers="password"
                    placeholder="Insira uma senha"
                  />
                </FormElements.FContainer>

                <FormElements.FContainer>
                  <FormElements.FLabels
                    title="Permissão de Acesso"
                    symbol="*"
                  />
                  <FormElements.FSelectSimpleContainer
                    registers="role"
                    icon={HiOutlineShieldCheck}
                  >
                    {roles.map((item: Role, index: number) => (
                      <FormElements.FSelectSimpleOption
                        placeholder="Selecione uma permissão..."
                        text={item.value}
                      />
                    ))}
                  </FormElements.FSelectSimpleContainer>
                </FormElements.FContainer>

                {/* Start Actions */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FAction
                    title="Voltar"
                    onClick={() => {
                      setOpenMFormsUpdated(false);
                      methods.reset();
                    }}
                  />
                  <FormElements.FAction title="Enviar" type="submit" />
                </FormElements.FContainer>
                {/* End Actions */}
              </FormElements.FBody>
            </FormProvider>
          </FormElements.Root>
        </ModalsForm.Root>
        {/* Form for updated */}
      </div>
    </>
  );
}
