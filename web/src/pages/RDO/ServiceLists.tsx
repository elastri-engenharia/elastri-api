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

import {
  Service,
  serviceFormData,
  serviceFormSchema,
} from "../../entity/Service";
import { Garden } from "../../entity/Garden";
import { SubField } from "../../entity/Subfield";
import { Area } from "../../entity/Area";
import { Measurement } from "../../entity/Measurement";
import { Construction } from "../../entity/Construction";

import {
  HiOutlineSquare3Stack3D,
  HiOutlineTrash,
  HiArrowDownTray,
  HiOutlinePencilSquare,
  HiMiniMagnifyingGlass,
  HiTrash,
  HiOutlineDocumentArrowDown,
  HiOutlineBuildingOffice2,
  HiOutlineCubeTransparent,
  HiOutlineMap,
  HiArrowsPointingOut,
  HiOutlineVariable,
} from "react-icons/hi2";

import { DevTool } from "@hookform/devtools";

export default function ServiceLists() {
  const queryClient = useQueryClient();

  const methods = useForm<serviceFormData>({
    resolver: zodResolver(serviceFormSchema),
    mode: "onChange",
  });

  const [search, setSearch] = useState<string>("");
  const [idService, setIdService] = useState<string>("");
  const [openMConfirmTrash, setOpenMConfirmTrash] = useState<boolean>(false);
  const [openMFormsCreated, setOpenMFormsCreated] = useState<boolean>(false);
  const [openMFormsUpdated, setOpenMFormsUpdated] = useState<boolean>(false);
  const [enableDisabled, setEnableDisabled] = useState<boolean>(false);

  const service = useQuery(["allServices"], () =>
    api.get("services").then((res) => res.data)
  );

  const garden = useQuery(["allGardens"], () =>
    api.get("gardens").then((res) => res.data)
  );

  const subfield = useQuery(["allSubfields"], () =>
    api.get("subfields").then((res) => res.data)
  );

  const measurement = useQuery(["allMeasurements"], () =>
    api.get("measurements").then((res) => res.data)
  );

  const area = useQuery(["allAreas"], () =>
    api.get("areas").then((res) => res.data)
  );

  const construction = useQuery(["allConstructions"], () =>
    api.get("constructions").then((res) => res.data)
  );

  const createdService = useMutation(
    (data) => api.post("services/create", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["allServices"]);
      },
    }
  );

  const handleSubmitCreated = async (value: Service) => {
    await createdService.mutateAsync(value);
    methods.reset();
  };

  const handleSubmitUpdated = (value: Service) => {
    console.log("update", value);
    methods.reset();
  };

  return (
    <>
      <Breadcrumb pageName="Listagem & Registro de Serviços" />

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
                placeholder="Busque Serviços..."
                required
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-between">
            <div className="">
              <button className="border-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2 inline-flex items-center rounded-lg border bg-primary px-3 py-2.5 text-sm font-medium text-white hover:bg-primary focus:outline-none focus:ring-4">
                <HiOutlineDocumentArrowDown className="h-7 w-7 pr-2 font-medium text-white" />
                Importar Serviços
              </button>
            </div>
            <div className="">
              <button
                className="border-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2 inline-flex items-center rounded-lg border bg-primary px-3 py-2.5 text-sm font-medium text-white hover:bg-primary focus:outline-none focus:ring-4"
                onClick={() => setOpenMFormsCreated(true)}
              >
                <HiOutlineSquare3Stack3D className="h-7 w-7 pr-2 font-medium text-white" />
                Novo Serviço
              </button>
            </div>
          </div>
        </div>

        <Tables.Root>
          <Tables.THead>
            <Tables.THContent
              item="Nome do Serviço"
              className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11"
            />
            <Tables.THContent item="Cód. TOTVS" className="min-w-[120px]" />
            <Tables.THContent item="Atividade" className="min-w-[250px]" />
            <Tables.THContent item="Parque" className="min-w-[120px]" />
            <Tables.THContent item="Subcampo" className="min-w-[80px]" />
            <Tables.THContent item="Área" className="min-w-[80px]" />
            <Tables.THContent item="Previsto" className="min-w-[80px]" />
            <Tables.THContent item="Avanço" className="min-w-[80px]" />
            <Tables.THContent item="Desat?" className="min-w-[80px]" />
            <Tables.THContent item="Ações" />
          </Tables.THead>
          {service.data?.services
            .filter((item: Service) => {
              return search.toLowerCase() === ""
                ? item
                : item.name_service.toLowerCase().includes(search) ||
                    item.activity.toLowerCase().includes(search);
            })
            .map((item: Service, index: number) => (
              <Tables.TBody key={index}>
                <Tables.TBContent
                  className="pl-9 xl:pl-11"
                  item={item.name_service}
                />
                <Tables.TBContent item={item.code_totvs} />
                <Tables.TBContent item={item.activity} />
                <Tables.TBContent item={item.garden.name} />
                <Tables.TBContent
                  className="text-center"
                  item={item.subfield ? item.subfield.name : "-"}
                />
                <Tables.TBContent
                  className="text-center"
                  item={item.Area ? item.Area.id_area : "-"}
                />
                <Tables.TBContent
                  className="text-center"
                  item={item.foreseen + item.undMeasure.symbol}
                />
                <Tables.TBContent
                  className="text-center"
                  item={item.advance + item.undMeasure.symbol}
                />
                <Tables.TBContent
                  item={item.disabled_service ? "Sim" : "Não"}
                />
                <Tables.TActions>
                  <Tables.TAction
                    icon={HiOutlinePencilSquare}
                    onClick={() => {
                      setOpenMFormsUpdated(true);
                      console.log(
                        item.construction_idConstruction.id_construction
                      );
                      methods.setValue("code_service", item.code_service);
                      methods.setValue("name_service", item.name_service);
                      methods.setValue("code_totvs", item.code_totvs);
                      methods.setValue("activity", item.activity);
                      methods.setValue(
                        "gardenId_garden",
                        item.garden.id_garden
                      );
                      methods.setValue(
                        "subFieldId_subField",
                        item.subfield?.id_subField
                      );
                      methods.setValue(
                        "measurementId_measurement",
                        item.undMeasure.id_measurement
                      );
                      methods.setValue("areaId_area", item.Area?.id_area);
                      methods.setValue("foreseen", item.foreseen);
                      methods.setValue("advance", item.advance);
                      methods.setValue(
                        "constructionId_construction",
                        item.construction_idConstruction.id_construction
                      );
                      setEnableDisabled(item.disabled_service);
                      setIdService(item.id_service);
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
            <FormElements.FHeader title="Create Service" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitCreated)}
              >
                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider className="xl:w-1/3">
                    <FormElements.FLabels
                      title="Código do Serviço"
                      symbol="*"
                    />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={createdService.isError}
                      responseError={createdService.error}
                      placeholder="Insira um código para o serviço"
                      registers="code_service"
                    />
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-2/3">
                    <FormElements.FLabels title="Nome do Serviço" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={createdService.isError}
                      responseError={createdService.error}
                      placeholder="Insira o nome do serviço"
                      registers="name_service"
                    />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider className="xl:w-1/3">
                    <FormElements.FLabels title="Código TOTVS" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={createdService.isError}
                      responseError={createdService.error}
                      placeholder="Insira código do TOTVS"
                      registers="code_totvs"
                    />
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-2/3">
                    <FormElements.FLabels title="Atividade" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={createdService.isError}
                      responseError={createdService.error}
                      placeholder="Insira o nome da atividade"
                      registers="activity"
                    />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                <FormElements.FContainer>
                  <FormElements.FLabels title="Obra" symbol="*" />
                  <FormElements.FSelectSimpleContainer
                    registers="constructionId_construction"
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
                </FormElements.FContainer>

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Parque" symbol="*" />
                    <FormElements.FSelectSimpleContainer
                      registers="gardenId_garden"
                      icon={HiOutlineMap}
                    >
                      {garden.data?.garden
                        .slice()
                        .sort((a: Garden, b: Garden) =>
                          a.name.localeCompare(b.name)
                        )
                        .map((item: Garden, index: number) => (
                          <FormElements.FSelectSimpleOption
                            placeholder="Selecione uma obra..."
                            value={item.id_garden}
                            option={item.name}
                          />
                        ))}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Subcampo" />
                    <FormElements.FSelectSimpleContainer
                      registers="subFieldId_subField"
                      icon={HiOutlineCubeTransparent}
                    >
                      <option value="">Selecione um subcampo...</option>
                      {subfield.data?.subfields
                        .slice()
                        .sort((a: SubField, b: SubField) =>
                          a.name.localeCompare(b.name)
                        )
                        .map((item: SubField, index: number) => (
                          <FormElements.FSelectSimpleOption
                            placeholder="Selecione um subcampo..."
                            value={item.id_subField}
                            option={item.name}
                          />
                        ))}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider className="xl:w-2/6">
                    <FormElements.FLabels title="Área" />
                    <FormElements.FSelectSimpleContainer
                      registers="areaId_area"
                      icon={HiArrowsPointingOut}
                    >
                      <option value="">Selecione uma área...</option>
                      {area.data?.areas
                        .slice()
                        .sort((a: Area, b: Area) =>
                          a.name.localeCompare(b.name)
                        )
                        .map((item: Area, index: number) => (
                          <FormElements.FSelectSimpleOption
                            placeholder="Selecione uma área..."
                            value={item.id_area}
                            option={item.name}
                          />
                        ))}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-2/6">
                    <FormElements.FLabels
                      title="Unidade de Medida"
                      symbol="*"
                    />
                    <FormElements.FSelectSimpleContainer
                      registers="measurementId_measurement"
                      icon={HiOutlineVariable}
                    >
                      {measurement.data?.measurements.map(
                        (item: Measurement, index: number) => (
                          <FormElements.FSelectSimpleOption
                            placeholder="Selecione um unidade de medida..."
                            value={item.id_measurement}
                            option={item.symbol}
                          />
                        )
                      )}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-2/6">
                    <FormElements.FLabels title="Previsto" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={createdService.isError}
                      responseError={createdService.error}
                      placeholder="Ex.: 12345.12"
                      registers="foreseen"
                    />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                <FormElements.FContainer>
                  <FormElements.FLabels title="Ativar/Desativar" />
                  <SwitcherOne
                    registers="disabled_service"
                    identify="toggle1"
                    status={enableDisabled}
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
            <DevTool control={methods.control} />
          </FormElements.Root>
        </ModalsForm.Root>
        {/* End Created */}

        {/* Start Updated */}
        <ModalsForm.Root isOpen={openMFormsUpdated}>
          <FormElements.Root>
            <FormElements.FHeader title="Updated Service" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitUpdated)}
              >
                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider className="xl:w-1/3">
                    <FormElements.FLabels
                      title="Código do Serviço"
                      symbol="*"
                    />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={service.isError}
                      responseError={service.error}
                      placeholder="Insira um código para o serviço"
                      registers="code_service"
                    />
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-2/3">
                    <FormElements.FLabels title="Nome do Serviço" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={service.isError}
                      responseError={service.error}
                      placeholder="Insira o nome do serviço"
                      registers="name_service"
                    />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider className="xl:w-1/3">
                    <FormElements.FLabels title="Código TOTVS" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={service.isError}
                      responseError={service.error}
                      placeholder="Insira código do TOTVS"
                      registers="code_totvs"
                    />
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-2/3">
                    <FormElements.FLabels title="Atividade" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={service.isError}
                      responseError={service.error}
                      placeholder="Insira o nome da atividade"
                      registers="activity"
                    />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                <FormElements.FContainer>
                  <FormElements.FLabels title="Obra" symbol="*" />
                  <FormElements.FSelectSimpleContainer
                    registers="constructionId_construction"
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
                </FormElements.FContainer>

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Parque" symbol="*" />
                    <FormElements.FSelectSimpleContainer
                      registers="gardenId_garden"
                      icon={HiOutlineMap}
                    >
                      {garden.data?.garden
                        .slice()
                        .sort((a: Garden, b: Garden) =>
                          a.name.localeCompare(b.name)
                        )
                        .map((item: Garden, index: number) => (
                          <FormElements.FSelectSimpleOption
                            placeholder="Selecione uma obra..."
                            value={item.id_garden}
                            option={item.name}
                          />
                        ))}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider>
                    <FormElements.FLabels title="Subcampo" />
                    <FormElements.FSelectSimpleContainer
                      registers="subFieldId_subField"
                      icon={HiOutlineCubeTransparent}
                    >
                      <option value="">Selecione um subcampo...</option>
                      {subfield.data?.subfields
                        .slice()
                        .sort((a: SubField, b: SubField) =>
                          a.name.localeCompare(b.name)
                        )
                        .map((item: SubField, index: number) => (
                          <FormElements.FSelectSimpleOption
                            placeholder="Selecione um subcampo..."
                            value={item.id_subField}
                            option={item.name}
                          />
                        ))}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                {/* Start Container for Divider - Ex.: className="flex flex-col gap-6 xl:flex-row" */}
                <FormElements.FContainer className="flex flex-col gap-6 xl:flex-row">
                  <FormElements.FContainerDivider className="xl:w-2/6">
                    <FormElements.FLabels title="Área" />
                    <FormElements.FSelectSimpleContainer
                      registers="areaId_area"
                      icon={HiArrowsPointingOut}
                    >
                      <option value="">Selecione uma área...</option>
                      {area.data?.areas
                        .slice()
                        .sort((a: Area, b: Area) =>
                          a.name.localeCompare(b.name)
                        )
                        .map((item: Area, index: number) => (
                          <FormElements.FSelectSimpleOption
                            placeholder="Selecione uma área..."
                            value={item.id_area}
                            option={item.name}
                          />
                        ))}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-2/6">
                    <FormElements.FLabels
                      title="Unidade de Medida"
                      symbol="*"
                    />
                    <FormElements.FSelectSimpleContainer
                      registers="measurementId_measurement"
                      icon={HiOutlineVariable}
                    >
                      {measurement.data?.measurements.map(
                        (item: Measurement, index: number) => (
                          <FormElements.FSelectSimpleOption
                            placeholder="Selecione um unidade de medida..."
                            value={item.id_measurement}
                            option={item.symbol}
                          />
                        )
                      )}
                    </FormElements.FSelectSimpleContainer>
                  </FormElements.FContainerDivider>

                  <FormElements.FContainerDivider className="xl:w-2/6">
                    <FormElements.FLabels title="Previsto" symbol="*" />
                    <FormElements.FInputs
                      type="text"
                      isResponseError={createdService.isError}
                      responseError={createdService.error}
                      placeholder="Ex.: 12345.12"
                      registers="foreseen"
                    />
                  </FormElements.FContainerDivider>
                </FormElements.FContainer>
                {/* End Container for Divider */}

                <FormElements.FContainer>
                  <FormElements.FLabels title="Ativar/Desativar" />
                  <SwitcherOne
                    registers="disabled_service"
                    identify="toggle1"
                    status={enableDisabled}
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
            <DevTool control={methods.control} />
          </FormElements.Root>
        </ModalsForm.Root>
        {/* End Updated */}
      </div>
    </>
  );
}
