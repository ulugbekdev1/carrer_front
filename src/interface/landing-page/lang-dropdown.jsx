import { Fragment, useEffect, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const people = [
  {
    id: 1,
    name: "O’zbekcha",
    type: "uz",
  },
  {
    id: 2,
    name: "English",
    type: "en",
  },
  {
    id: 3,
    name: "Русский",
    type: "ru",
  },
];

export default function LangDrop() {
  const select = JSON.parse(localStorage.getItem("selectLang"));
  const [selected, setSelected] = useState(select ? select : people[0]);
  useEffect(() => {
    localStorage.setItem("selectLang", JSON.stringify(selected));
  }, [selected]);
  return (
    <div className="">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <ListboxButton className="w-40 relative cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border-[1px] border-solid border-[#EAECF0] focus:outline-none">
            <div className="flex justify-start items-center gap-[8px]">
              <img src={selected.icon} alt="" />
              <h1>{selected.name}</h1>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="w-48 absolute mt-1 max-h-60 right-0 overflow-auto rounded-md text-[#344054] text-[14px] font-[600] bg-white py-1 border-[1px] border-solid border-[#EAECF0]">
              {people.map((person, personIdx) => (
                <ListboxOption
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4  ${
                      active ? "bg-[#F9FAFB] " : "bg-[#fff]"
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        <div className="flex justify-start items-center gap-[8px]">
                          <img src={person.icon} alt="" />
                          <h1>{person.name}</h1>
                        </div>
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
