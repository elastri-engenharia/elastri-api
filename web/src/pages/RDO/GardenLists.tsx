import { api } from "../../services/api";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import Breadcrumb from "../../components/Breadcrumb";

import { Garden, gardenFormData, gardenFormSchema } from "../../entity/Garden";
import { ModalsConfirmation } from "../../components/ModalConfirmation";
import { FormElements } from "../../components/FormElements";
import { ModalsForm } from "../../components/ModalForms";
import { Tables } from "../../components/Tables";

import {
  HiArrowDownTray,
  HiMiniMagnifyingGlass,
  HiOutlineDocumentArrowDown,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMap,
  HiTrash,
} from "react-icons/hi2";

export default function GardenLists() {
  const queryClient = useQueryClient();

  const methods = useForm<gardenFormData>({
    resolver: zodResolver(gardenFormSchema),
    mode: "onChange",
  });

  const [search, setSearch] = useState<string>("");
  const [idGarden, setIdGarden] = useState<string>("");
  const [openMConfirmTrash, setOpenMConfirmTrash] = useState<boolean>(false);
  const [openMFormsCreated, setOpenMFormsCreated] = useState<boolean>(false);
  const [openMFormsUpdated, setOpenMFormsUpdated] = useState<boolean>(false);

  const garden = useQuery(["allGardens"], () =>
    api.get("gardens").then((res) => res.data)
  );

  const createdGarden = useMutation(
    (data) => api.post("gardens/create", data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["allGardens"]);
      },
    }
  );

  const updatedGarden = useMutation(
    (data) => api.patch(`/gardens/${idGarden}/update`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["allGardens"]);
      },
    }
  );

  const handleSubmitCreated = async (value: Garden) => {
    await createdGarden.mutateAsync(value);
    methods.reset();
  };

  const handleSubmitUpdated = async (value: Garden) => {
    await updatedGarden.mutateAsync(value);
    methods.reset();
  };

  return (
    <>
      <Breadcrumb pageName="Listagem & Registro de Garden" />

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
                Importar Parque
              </button>
            </div>
            <div className="">
              <button
                className="border-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2 inline-flex items-center rounded-lg border bg-primary px-3 py-2.5 text-sm font-medium text-white hover:bg-primary focus:outline-none focus:ring-4"
                onClick={() => setOpenMFormsCreated(true)}
              >
                <HiOutlineMap className="h-7 w-7 pr-2 font-medium text-white" />
                Novo Parque
              </button>
            </div>
          </div>
        </div>

        <Tables.Root>
          <Tables.THead>
            <Tables.THContent
              item="Parque"
              className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11"
            />
            <Tables.THContent item="Ações" />
          </Tables.THead>
          {garden.data?.garden
            .filter((item: Garden) => {
              return search.toLowerCase() === ""
                ? item
                : item.name.toLowerCase().includes(search);
            })
            .map((item: Garden, index: number) => (
              <Tables.TBody key={index}>
                <Tables.TBContent item={item.name} className="pl-9 xl:pl-11" />
                <Tables.TActions>
                  <Tables.TAction
                    icon={HiOutlinePencilSquare}
                    onClick={() => {
                      setOpenMFormsUpdated(true);
                      methods.setValue("name", item.name);
                      setIdGarden(item.id_garden);
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
            <FormElements.FHeader title="Create Garden" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitCreated)}
              >
                <FormElements.FContainer>
                  <FormElements.FLabels title="Parque" symbol="*" />
                  <FormElements.FInputs
                    type="text"
                    isResponseError={createdGarden.isError}
                    responseError={createdGarden.error}
                    placeholder="Insira o nome do parque..."
                    registers="name"
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
            <FormElements.FHeader title="Updated Garden" />
            <FormProvider {...methods}>
              <FormElements.FBody
                onSubmit={methods.handleSubmit(handleSubmitUpdated)}
              >
                <FormElements.FContainer>
                  <FormElements.FLabels title="Parque" symbol="*" />
                  <FormElements.FInputs
                    type="text"
                    isResponseError={updatedGarden.isError}
                    responseError={updatedGarden.error}
                    placeholder="Insira o nome do parque..."
                    registers="name"
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
