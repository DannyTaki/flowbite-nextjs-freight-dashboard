import React from "react";
import { Modal, Button } from "flowbite-react";

interface ProductModalProps {
    show: boolean;
    onClose: () => void;
    localInput: { packaging_type?: string; unit_container_type?: string } | null;
    handleInputChange: (field: string, value: string) => void;
    handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  }
const ProductModal: React.FC<ProductModalProps> = ({
  show,
  onClose,
  localInput,
  handleInputChange,
  handleFormSubmit,
}) => {
  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header></Modal.Header>
      <Modal.Body>
        <form className="p-4 md:p-5" onSubmit={handleFormSubmit}>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="packaging_type"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Packaging Type
              </label>
              <input
                onChange={(e) => handleInputChange("packaging_type", e.target.value)}
                type="text"
                name="packaging_type"
                id="packaging_type"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder="Type the packaging type"
                required={true}
                value={localInput?.packaging_type || ""}
              />
            </div>
            <div>
              <label
                htmlFor="unit_container_type"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Unit Container Type
              </label>
              <input
                onChange={(e) => handleInputChange("unit_container_type", e.target.value)}
                type="text"
                name="unit_container_type"
                id="unit_container_type"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
                placeholder="Type the unit container type"
                required={true}
                value={localInput?.unit_container_type || ""}
              />
            </div>
          </div>
          <Modal.Footer className="flex justify-center">
            <Button type="submit">Update</Button>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
