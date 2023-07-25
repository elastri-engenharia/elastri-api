interface ModalConfirmationContentProps {
  title: string;
  message?: string;
}

export function ModalConfirmationHeadContent({
  title,
  message,
}: ModalConfirmationContentProps) {
  return (
    <>
      <p className="text-center text-xl font-medium text-black dark:text-white">
        {title}
      </p>
      {!!message && (
        <p className="text-center text-xl font-normal text-warning">
          {message}
        </p>
      )}
    </>
  );
}
