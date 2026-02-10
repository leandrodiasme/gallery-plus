import { type VariantProps, tv } from "tailwind-variants";
import Icon from "./icon";
import Text, { textVariants } from "./text";
import uploadFileIcon from "../assets/icons/upload-file.svg?react";
import FileImageIcon from "../assets/icons/image.svg?react";
import { useWatch } from "react-hook-form";
import React from "react";

export const inputSingleFileVariants = tv({
  base: `flex flex-col items-center justify-center w-full border border-solid border-border-primary group-hover:border-border-active rounded-lg gap-1 transition`,
  variants: {
    size: {
      md: "px-5 py-6",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export const inputSingleFileIconVariants = tv({
  base: "fill-placeholder",
  variants: {
    size: {
      md: "w-8 h-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface InputSingleFileProps
  extends
    VariantProps<typeof inputSingleFileVariants>,
    Omit<React.ComponentProps<"input">, "size"> {
  form: any;
  allowedExtensions: string[];
  maxFileSize: number;
  replaceBy: React.ReactNode;
  error?: React.ReactNode;
}

export default function InputSingleFile({
  size,
  error,
  form,
  allowedExtensions,
  replaceBy,
  maxFileSize,
  ...props
}: InputSingleFileProps) {
  const formValues = useWatch({ control: form.control });
  const name = props.name || "";

  const formFile = React.useMemo<File | undefined>(() => {
    return formValues?.[name]?.[0];
  }, [formValues, name]);

  // (opcional) remover: limpa o campo no RHF
  const handleRemove = () => {
    if (!name) return;
    form.setValue(name, null);
    form.clearErrors?.(name);
  };

  const { fileExtension, fileSize } = React.useMemo(
    () => ({
      fileExtension:
        formFile?.name?.split(".")?.pop()?.toLocaleLowerCase() || "",
      fileSize: formFile?.size || 0,
    }),
    [formFile],
  );

  function isValidExtension() {
    return allowedExtensions.includes(fileExtension);
  }

  function isValidSize() {
    return fileSize <= maxFileSize * 1024 * 1024;
  }

  function isValidFile() {
    return isValidExtension() && isValidSize();
  }

  return (
    <div className="w-full relative group cursor-pointer">
      {/* Deixa o input SEMPRE presente para poder trocar arquivo */}
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        {...props}
      />

      {!formFile || !isValidFile() ? (
        <>
          <div className={inputSingleFileVariants({ size })}>
            <Icon
              svg={uploadFileIcon}
              className={inputSingleFileIconVariants({ size })}
            />
            <Text
              variant="label-medium"
              className="text-placeholder text-center"
            >
              Arraste o arquivo ou clique aqui
            </Text>
          </div>
          <div className="flex flex-col gap-1 mt-1">
            {formFile && !isValidExtension() && (
              <Text variant="label-small" className="text-accent-red mt-1">
                Tipo de arquivo inválido
              </Text>
            )}
            {formFile && !isValidSize() && (
              <Text variant="label-small" className="text-accent-red mt-1">
                Tamanho excede o limite
              </Text>
            )}
            {error && (
              <Text variant="label-small" className="text-accent-red mt-1">
                {error}
              </Text>
            )}
          </div>
        </>
      ) : (
        <>
          <div>{replaceBy}</div>
          <div className="flex gap-3 items-center border border-solid border-border-primary mt-5 p-3 rounded">
            <Icon svg={FileImageIcon} className="fill-white w-6 h-6" />

            <div className="flex flex-col min-w-0">
              <div className="truncate max-w-80">
                <Text variant="label-medium">{formFile.name}</Text>
              </div>

              <div className="flex">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className={textVariants({
                    variant: "label-small",
                    className: "text-accent-red cursor-pointer hover:underline",
                  })}
                >
                  Remover
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
