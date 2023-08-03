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

import Loader from "../../common/Loader";

import {
  Construction,
  constructionFormData,
  constructionFormSchema,
} from "../../entity/Construction";
import { User } from "../../entity/User";

export default function ConstructionLists() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState<string>("");
  const [idConstruction, setIdConstruction] = useState<string>("");

  const [openMConfirmTrash, setOpenMConfirmTrash] = useState<boolean>(false);
  const [openMFormsCreated, setOpenMFormsCreated] = useState<boolean>(false);
  const [openMFormsUpdated, setOpenMFormsUpdated] = useState<boolean>(false);

  const methods = useForm<constructionFormData>({
    resolver: zodResolver(constructionFormSchema),
  });

  const construction = useQuery(["allConstructions"], () =>
    api.get("constructions").then((res) => res.data)
  );

  const users = useQuery(["allUsers"], () =>
    api.get("users").then((res) => res.data)
  );

  const selectedUser = construction.data?.constructions.find(
    (item: Construction) => item.id_construction === idConstruction
  );

  const selected = selectedUser?.users.map((user: User) => user.username);

  const option = users.data?.users.map((item: User) => item.username);

  const createdConstruction = useMutation(
    (data) => api.post("constructions/create", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["allConstructions"]);
      },
    }
  );

  const updatedConstruction = useMutation(
    (data) => api.patch(`constructions/${idConstruction}/update`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["allConstructions"]);
      },
    }
  );

  const handleSubmitCreated = async (value: Construction) => {
    await createdConstruction.mutateAsync(value);
    methods.reset();
  };

  const handleSubmitUpdated = async (value: Construction) => {
    const users = value.users?.map((item, index) => ({
      username: item,
    }));

    const construction = {
      code_construction: value.code_construction,
      name_construction: value.name_construction,
      users,
    };

    await updatedConstruction.mutateAsync(construction);
    methods.reset();
  };

  if (updatedConstruction.isLoading || createdConstruction.isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb pageName="Listagem & Registro de Obras" />

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
                placeholder="Buscar Obras..."
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
                Nova Obra
              </button>
            </div>
          </div>
        </div>

        <Tables.Root>
          <Tables.THead>
            <Tables.THContent
              item="Cód. Obra"
              className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11"
            />
            <Tables.THContent item="Nome da Obra" className="min-w-[120px]" />
            <Tables.THContent item="Ações" />
          </Tables.THead>
          {construction.data?.constructions
            .filter((item: Construction) => {
              return search.toLowerCase() === ""
                ? item
                : item.code_construction.toLowerCase().includes(search) ||
                    item.name_construction.toLowerCase().includes(search);
            })
            .map((item: Construction, index: number) => (
              <Tables.TBody key={index}>
                <Tables.TBContent
                  item={item.code_construction}
                  className="pl-9 xl:pl-11"
                />
                <Tables.TBContent item={item.name_construction} />
                <Tables.TActions>
                  <Tables.TAction
                    icon={HiOutlinePencilSquare}
                    onClick={() => {
                      setOpenMFormsUpdated(true);
                      methods.setValue(
                        "code_construction",
                        item.code_construction
                      );
                      methods.setValue(
                        "name_construction",
                        item.name_construction
                      );
                      setIdConstruction(item.id_construction);
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
            <FormElements.FHeader title="Create Construction" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitCreated)}
              >
                <FormElements.FContainer>
                  <FormElements.FLabels title="Código da Obra" symbol="*" />
                  <FormElements.FInputs
                    type="text"
                    isResponseError={construction.isError}
                    responseError={construction.error}
                    registers="code_construction"
                    placeholder="Insira Código da Obra"
                  />
                </FormElements.FContainer>

                <FormElements.FContainer>
                  <FormElements.FLabels title="Nome da Obra" symbol="*" />
                  <FormElements.FInputs
                    type="text"
                    isResponseError={construction.isError}
                    responseError={construction.error}
                    registers="name_construction"
                    placeholder="Insira o Nome da Obra"
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
            <FormElements.FHeader title="Update Construction" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitUpdated)}
              >
                <FormElements.FContainer>
                  <FormElements.FLabels title="Código da Obra" symbol="*" />
                  <FormElements.FInputs
                    type="text"
                    isResponseError={construction.isError}
                    responseError={construction.error}
                    registers="code_construction"
                    placeholder="Insira Código da Obra"
                  />
                </FormElements.FContainer>

                <FormElements.FContainer>
                  <FormElements.FLabels title="Nome da Obra" symbol="*" />
                  <FormElements.FInputs
                    type="text"
                    isResponseError={construction.isError}
                    responseError={construction.error}
                    registers="name_construction"
                    placeholder="Insira o Nome da Obra"
                  />
                </FormElements.FContainer>

                <FormElements.FContainer>
                  <FormElements.FLabels title="Usuários" symbol="*" />
                  <FormElements.FSelectMult
                    optionTitle="Selecions um ou mais usuários"
                    selected={selected}
                    option={option}
                    registers="users"
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
