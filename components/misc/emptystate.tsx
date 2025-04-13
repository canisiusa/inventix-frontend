import NoResults from "@/assets/NoResults.svg";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react"

interface IEmptyStateUIProps {
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyStateUI = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & IEmptyStateUIProps>(
  (
    { className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex justify-center items-center h-full w-full overflow-hidden relative",
          className
        )}
      >
        <div className="w-96 flex-col justify-start items-center inline-flex z-10">
          <Image src={NoResults} width={170} height={170} alt="" />
          <div className="self-stretch flex-col justify-start items-center gap-2 flex">
            <span className="self-stretch text-center text-base text-[#667085] font-semibold">
              {props.title}
            </span>
            <span className="self-stretch text-center text-gray-600 text-sm">
              {props.description}
            </span>
          </div>
          {props.action}
        </div>
      </div>
    );
  }

);




EmptyStateUI.displayName = "EmptyStateUI";


export default EmptyStateUI;
