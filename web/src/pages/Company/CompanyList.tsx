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
} from "react-icons/hi2";

import Breadcrumb from "../../components/Breadcrumb";
import { Tables } from "../../components/Tables";

import { ModalsConfirmation } from "../../components/ModalConfirmation";
import { ModalsForm } from "../../components/ModalForms";
import { FormElements } from "../../components/FormElements";

import {
  companyFormData,
  companyFormSchema,
  Company,
} from "../../entity/Company";

import Loader from "../../common/Loader";
import { User } from "../../entity/User";

export default function UserLists() {
  const methods = useForm<companyFormData>({
    resolver: zodResolver(companyFormSchema),
  });

  const queryClient = useQueryClient();

  const [search, setSearch] = useState<string>("");
  const [idCompany, setIdCompany] = useState<string>("");
  const [openMConfirmTrash, setOpenMConfirmTrash] = useState<boolean>(false);
  const [openMFormsCreated, setOpenMFormsCreated] = useState<boolean>(false);
  const [openMFormsUpdated, setOpenMFormsUpdated] = useState<boolean>(false);

  const company = useQuery(["allCompany"], () =>
    api.get("companys").then((res) => res.data)
  );

  const user = useQuery(["allUsers"], () =>
    api.get("users").then((res) => res.data)
  );

  const createdCompany = useMutation(
    (data) => api.post("companys/create", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("allCompany");
      },
    }
  );

  const updatedCompany = useMutation(
    (data) => api.patch(`companys/${idCompany}/update`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("allCompany");
      },
    }
  );

  const selectedUser = company.data?.companys.find(
    (item: Company) => item.id_company === idCompany
  );

  const selected = selectedUser?.users.map((user: User) => user.username);

  const option = user.data?.users.map((item: User) => item.username);

  const handleSubmitCreated = async (value: Company) => {
    await createdCompany.mutateAsync(value);
    methods.reset();
  };

  const handleSubmitUpdated = async (value: Company) => {
    const users = value.users?.map((item, index) => ({
      username: item,
    }));

    const company = {
      company_name: value.company_name,
      users,
    };

    await updatedCompany.mutateAsync(company);
    methods.reset();
  };

  if (updatedCompany.isLoading || createdCompany.isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb pageName="Listagem & Registro de Empresa" />

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
                placeholder="Buscar Empresas..."
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
                Nova Empresa
              </button>
            </div>
          </div>
        </div>

        <Tables.Root>
          <Tables.THead>
            <Tables.THContent
              item="Empresa"
              className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11"
            />
            <Tables.THContent item="Ações" />
          </Tables.THead>
          {company.data?.companys
            .filter((item: Company) => {
              return search.toLowerCase() === ""
                ? item
                : item.company_name.toLowerCase().includes(search);
            })
            .map((item: Company, index: number) => (
              <Tables.TBody key={index}>
                <Tables.TBContent
                  item={item.company_name}
                  className="pl-9 xl:pl-11"
                />
                <Tables.TActions>
                  <Tables.TAction
                    icon={HiOutlinePencilSquare}
                    onClick={() => {
                      setOpenMFormsUpdated(true);
                      methods.setValue("company_name", item.company_name);
                      setIdCompany(item.id_company);
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
            <FormElements.FHeader title="Create Company" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitCreated)}
              >
                <FormElements.FContainer>
                  <FormElements.FLabels title="Nome da Empresa" symbol="*" />
                  <FormElements.FInputs
                    type="text"
                    isResponseError={createdCompany.isError}
                    responseError={createdCompany.error}
                    registers="company_name"
                    placeholder="Insira Nome da Empresa"
                  />
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
            <FormElements.FHeader title="Update Company" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitUpdated)}
              >
                <FormElements.FContainer>
                  <FormElements.FLabels title="Nome da Empresa" symbol="*" />
                  <FormElements.FInputs
                    type="text"
                    isResponseError={updatedCompany.isError}
                    responseError={updatedCompany.error}
                    registers="company_name"
                    placeholder="Insira Nome da Empresa"
                  />
                </FormElements.FContainer>

                <FormElements.FContainer>
                  <FormElements.FLabels title="Usuários" symbol="*" />
                  <FormElements.FSelectMult
                    optionTitle="Selecione um ou mais usuários..."
                    selected={selected}
                    option={option}
                    registers={"users"}
                  />
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
