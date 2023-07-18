import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";

import Breadcrumb from "../../components/Breadcrumb";
import { Tables } from "../../components/Tables";

import { Collaborator } from "../../entity/Collaborator";

import {
  HiUserPlus,
  HiOutlineTrash,
  HiArrowDownTray,
  HiOutlineEye,
  HiMiniMagnifyingGlass,
} from "react-icons/hi2";

const CollabDashboard = () => {
  const [search, setSearch] = useState("");

  const collaborator = useQuery(["hello"], () =>
    api.get("collaborators").then((res) => res.data)
  );

  return (
    <>
      <Breadcrumb pageName="Collaborator" />

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
          <div className="">
            <button
              type=""
              className="border-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2 inline-flex items-center rounded-lg border bg-primary px-3 py-2.5 text-sm font-medium text-white hover:bg-primary focus:outline-none focus:ring-4"
            >
              <HiUserPlus className="h-7 w-7 pr-2 font-medium text-white" />
              Novo Colaborador
            </button>
          </div>
          <div className="">
            <button
              type="submit"
              className="border-blue-700 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2 inline-flex items-center rounded-lg border bg-primary px-3 py-2.5 text-sm font-medium text-white hover:bg-primary focus:outline-none focus:ring-4"
            >
              <HiUserPlus className="h-7 w-7 pr-2 font-medium text-white" />
              Novo Colaborador
            </button>
          </div>
        </div>

        <Tables.Root>
          <Tables.THead />
          {collaborator.data?.collaborators
            .filter((item: Collaborator) => {
              return search.toLowerCase() === ""
                ? item
                : item.matriculation.toLowerCase().includes(search) ||
                    item.name_collaborator.toLowerCase().includes(search);
            })
            .map((item: Collaborator, index: number) => (
              <Tables.TBody index={index}>
                <Tables.TBContent
                  item={item.matriculation}
                  className="pl-9 xl:pl-11"
                />
                <Tables.TBContent item={item.name_collaborator} />
                <Tables.TBContent item={item.office_collaborator} />
                <Tables.TBContent
                  item={item.disabled_collaborator ? "Não" : "Sim"}
                />
                <Tables.TBContent item={item.responsible ? "Sim" : "Não"} />
                <Tables.TActions>
                  <Tables.TAction icon={HiOutlineEye} />
                  <Tables.TAction icon={HiOutlineTrash} />
                  <Tables.TAction icon={HiArrowDownTray} />
                </Tables.TActions>
              </Tables.TBody>
            ))}
        </Tables.Root>
        {/* <TableCollaboratorDashboard search={search} /> */}
      </div>
    </>
  );
};

export default CollabDashboard;
