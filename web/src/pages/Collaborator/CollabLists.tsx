/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";

import { Tables } from "../../components/Tables";
import { ModalsConfirmation } from "../../components/ModalConfirmation";
import { ModalsForm } from "../../components/ModalForms";
import { FormElements } from "../../components/FormElements";

import Breadcrumb from "../../components/Breadcrumb";
import SwitcherOne from "../../components/SwitcherOne";

import { Construction } from "../../entity/Construction";

import {
  Collaborator,
  Gender,
  collaboratorFormData,
  collaboratorFormSchema,
  genders,
} from "../../entity/Collaborator";

import {
  HiUserPlus,
  HiOutlineTrash,
  HiArrowDownTray,
  HiOutlinePencilSquare,
  HiMiniMagnifyingGlass,
  HiTrash,
  HiOutlineDocumentArrowDown,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

import { PiGenderIntersexBold } from "react-icons/pi";

export default function CollabLists() {
  const queryClient = useQueryClient();

  const methods = useForm<collaboratorFormData>({
    resolver: zodResolver(collaboratorFormSchema),
    mode: "onChange",
  });

  const [search, setSearch] = useState<string>("");
  const [idCollaborator, setIdCollaborator] = useState<string>("");
  const [openMConfirmTrash, setOpenMConfirmTrash] = useState<boolean>(false);
  const [openMFormsCreated, setOpenMFormsCreated] = useState<boolean>(false);
  const [openMFormsUpdated, setOpenMFormsUpdated] = useState<boolean>(false);
  const [enableResponsible, setEnableResposible] = useState<boolean>(false);

  const collaborator = useQuery(["allCollaborators"], () =>
    api.get("collaborators").then((res) => res.data)
  );

  const construction = useQuery(["allConstruction"], () =>
    api.get("constructions").then((res) => res.data)
  );

  const createdCollaborator = useMutation(
    (data) => api.post("collaborators/create", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["allCollaborators"]);
      },
    }
  );

  const updatedCollaborator = useMutation(
    (data) => api.put(`collaborators/${idCollaborator}/update`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["allCollaborators"]);
      },
    }
  );

  const handleSubmitCreated = async (value: Collaborator) => {
    await createdCollaborator.mutateAsync(value);
    methods.reset();
  };

  const handleSubmitUpdated = async (value: Collaborator) => {
    await updatedCollaborator.mutateAsync(value);
    methods.reset();
  };

  return (
    <>
      <Breadcrumb pageName="Listagem & Registro de Colaboradores" />

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
                placeholder="Busque Colaboradores..."
                required
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="">
              <button className="border-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2 inline-flex items-center rounded-lg border bg-primary px-3 py-2.5 text-sm font-medium text-white hover:bg-primary focus:outline-none focus:ring-4">
                <HiOutlineDocumentArrowDown className="h-7 w-7 pr-2 font-medium text-white" />
                Importar Colaboradores
              </button>
            </div>
            <div className="">
              <button
                className="border-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2 inline-flex items-center rounded-lg border bg-primary px-3 py-2.5 text-sm font-medium text-white hover:bg-primary focus:outline-none focus:ring-4"
                onClick={() => setOpenMFormsCreated(true)}
              >
                <HiUserPlus className="h-7 w-7 pr-2 font-medium text-white" />
                Novo Colaborador
              </button>
            </div>
          </div>
        </div>

        <Tables.Root>
          <Tables.THead>
            <Tables.THContent
              item="Mat."
              className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11"
            />
            <Tables.THContent item="Nome" className="min-w-[250px]" />
            <Tables.THContent item="Função" className="min-w-[120px]" />
            <Tables.THContent
              item="Data Admissão"
              className="min-w-[120px] text-center"
            />
            <Tables.THContent
              item="Data Demissão"
              className="min-w-[120px] text-center"
            />
            <Tables.THContent item="Resp?" className="min-w-[80px]" />
            <Tables.THContent item="Desat?" className="min-w-[80px]" />
            <Tables.THContent item="Ações" />
          </Tables.THead>
          {collaborator.data?.collaborators
            .filter((item: Collaborator) => {
              return search.toLowerCase() === ""
                ? item
                : item.matriculation.toLowerCase().includes(search) ||
                    item.name_collaborator.toLowerCase().includes(search);
            })
            .map((item: Collaborator, index: number) => (
              <Tables.TBody key={index}>
                <Tables.TBContent
                  item={item.matriculation}
                  className="pl-9 xl:pl-11"
                />
                <Tables.TBContent item={item.name_collaborator} />
                <Tables.TBContent item={item.office_collaborator} />
                <Tables.TBContent
                  className="text-center"
                  item={item.admission_date.split("-").reverse().join("/")}
                />
                <Tables.TBContent
                  className="text-center"
                  item={
                    item.resignation_date
                      ? item.resignation_date.split("-").reverse().join("/")
                      : "-"
                  }
                />
                <Tables.TBContent item={item.responsible ? "Sim" : "Não"} />
                <Tables.TBContent
                  item={item.disabled_collaborator ? "Sim" : "Não"}
                />
                <Tables.TActions>
                  <Tables.TAction
                    icon={HiOutlinePencilSquare}
                    onClick={() => {
                      setOpenMFormsUpdated(true);
                      methods.setValue("matriculation", item.matriculation);
                      methods.setValue(
                        "name_collaborator",
                        item.name_collaborator
                      );
                      methods.setValue(
                        "office_collaborator",
                        item.office_collaborator
                      );
                      methods.setValue("city", item.city);
                      methods.setValue("gender", item.gender);
                      methods.setValue(
                        "construction_idConstruction",
                        item.construction_idConstruction.id_construction
                      );
                      methods.setValue("admission_date", item.admission_date);
                      methods.setValue(
                        "resignation_date",
                        item.resignation_date
                      );
                      setEnableResposible(item.responsible);
                      setIdCollaborator(item.id_collaborator);
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

        {/* Start Created */}
        <ModalsForm.Root isOpen={openMFormsCreated}>
          <FormElements.Root>
            <FormElements.FHeader title="Create Collaborators" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitCreated)}
              >
                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider className="xl:w-1/3">
                    <FormElements.FLabels title="Matrícula" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={createdCollaborator.isError}
                      responseError={createdCollaborator.error}
                      placeholder="Insira a matrícula"
                      registers="matriculation"
                    />
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-2/3">
                    <FormElements.FLabels title="Nome Colaborador" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={createdCollaborator.isError}
                      responseError={createdCollaborator.error}
                      placeholder="Insira o nome do colaborador"
                      registers="name_collaborator"
                    />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Função" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={createdCollaborator.isError}
                      responseError={createdCollaborator.error}
                      placeholder="Insira a função do colaborador"
                      registers="office_collaborator"
                    />
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Cidade" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={createdCollaborator.isError}
                      responseError={createdCollaborator.error}
                      placeholder="Insira o cidade"
                      registers="city"
                    />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider className="xl:w-3/4">
                    <FormElements.FLabels title="Obra" symbol="*" />
                    <FormElements.FSelectSimpleContainer
                      registers="construction_idConstruction"
                      icon={HiOutlineBuildingOffice2}
                    >
                      {construction.data?.constructions.map(
                        (item: Construction, index: number) => (
                          <FormElements.FSelectSimpleOption
                            placeholder="Selecione uma obra..."
                            value={item.id_construction}
                            option={item.name_construction}
                          />
                        )
                      )}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-1/4">
                    <FormElements.FLabels title="Gênero" symbol="*" />
                    <FormElements.FSelectSimpleContainer
                      registers="gender"
                      icon={PiGenderIntersexBold}
                    >
                      {genders.map((item: Gender, index: number) => (
                        <FormElements.FSelectSimpleOption
                          placeholder="Selecione o gênero..."
                          option={item.value}
                        />
                      ))}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Data de Admissão" symbol="*" />
                    <FormElements.FDate registers="admission_date" />
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Data de Demissão" />
                    <FormElements.FDate registers="resignation_date" />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                <FormElements.FContainer>
                  <FormElements.FLabels title="Responsável" />
                  <SwitcherOne
                    registers="responsible"
                    identify="toggle1"
                    status={enableResponsible}
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
        {/* End Created */}

        {/* Start Updated */}
        <ModalsForm.Root isOpen={openMFormsUpdated}>
          <FormElements.Root>
            <FormElements.FHeader title="Updated Collaborators" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitUpdated)}
              >
                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider className="xl:w-1/3">
                    <FormElements.FLabels title="Matrícula" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={updatedCollaborator.isError}
                      responseError={updatedCollaborator.error}
                      placeholder="Insira a matrícula"
                      registers="matriculation"
                    />
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-2/3">
                    <FormElements.FLabels title="Nome Colaborador" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={updatedCollaborator.isError}
                      responseError={updatedCollaborator.error}
                      placeholder="Insira o nome do colaborador"
                      registers="name_collaborator"
                    />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Função" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={updatedCollaborator.isError}
                      responseError={updatedCollaborator.error}
                      placeholder="Insira a função do colaborador"
                      registers="office_collaborator"
                    />
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Cidade" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={updatedCollaborator.isError}
                      responseError={updatedCollaborator.error}
                      placeholder="Insira o cidade"
                      registers="city"
                    />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider className="xl:w-3/4">
                    <FormElements.FLabels title="Obra" symbol="*" />
                    <FormElements.FSelectSimpleContainer
                      registers="construction_idConstruction"
                      icon={HiOutlineBuildingOffice2}
                    >
                      {construction.data?.constructions.map(
                        (item: Construction, index: number) => (
                          <FormElements.FSelectSimpleOption
                            placeholder="Selecione uma obra..."
                            value={item.id_construction}
                            option={item.name_construction}
                          />
                        )
                      )}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-1/4">
                    <FormElements.FLabels title="Gênero" symbol="*" />
                    <FormElements.FSelectSimpleContainer
                      registers="gender"
                      icon={PiGenderIntersexBold}
                    >
                      {genders.map((item: Gender, index: number) => (
                        <FormElements.FSelectSimpleOption
                          placeholder="Selecione o gênero..."
                          option={item.value}
                        />
                      ))}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Data de Admissão" symbol="*" />
                    <FormElements.FDate registers="admission_date" />
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Data de Demissão" />
                    <FormElements.FDate registers="resignation_date" />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                <FormElements.FContainer>
                  <FormElements.FLabels title="Responsável" />
                  <SwitcherOne
                    registers="responsible"
                    identify="toggle1"
                    status={enableResponsible}
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
        {/* End Updated */}
      </div>
    </>
  );
}
