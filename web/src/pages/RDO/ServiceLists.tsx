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

import {
  HiOutlineSquare3Stack3D,
  HiOutlineTrash,
  HiArrowDownTray,
  HiOutlinePencilSquare,
  HiMiniMagnifyingGlass,
  HiTrash,
  HiOutlineDocumentArrowDown,
  HiOutlineBuildingOffice2,
} from "react-icons/hi2";

import { PiGenderIntersexBold } from "react-icons/pi";

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

  const service = useQuery(["allservices"], () =>
    api.get("services").then((res) => res.data)
  );

  console.log("", service.data?.services);

  const handleSubmitCreated = (value: Service) => {
    console.log("create", value);
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
                  item={item.subfield ? item.subfield.name : "-"}
                />
                <Tables.TBContent
                  item={item.areaId_area ? item.areaId_area : "-"}
                />
                <Tables.TBContent
                  item={item.foreseen + item.undMeasure.symbol}
                />
                <Tables.TBContent
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
        dis
      </div>
    </>
  );
}
