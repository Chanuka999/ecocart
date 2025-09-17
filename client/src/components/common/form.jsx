import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const CommonForm = ({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
}) => {
  function renderInputByComponentType(getControllItem) {
    let element = null;
    const value = formData;

    switch (getControllItem.componentType) {
      case "input":
        element = (
          <input
            name={getControllItem.name}
            placeholder={getControllItem.placeholder}
            id={getControllItem.name}
            type={getControllItem.type}
            typeof={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControllItem.name]: event.target.value,
              })
            }
          />
        );
        break;
      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({ ...formData, [getControllItem.name]: value })
            }
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={getControllItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getControllItem.options && getControllItem.options.length > 0
                ? getControllItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControllItem.name}
            placeholder={getControllItem.placeholder}
            id={getControllItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControllItem.name]: event.target.value,
              })
            }
          />
        );
        break;

      default:
        element = (
          <input
            name={getControllItem.name}
            placeholder={getControllItem.placeholder}
            id={getControllItem.name}
            type={getControllItem.type}
            typeof={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControllItem.name]: event.target.value,
              })
            }
          />
        );
    }
    return element;
  }
  return (
    <form className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {formControls.map((controlItem) => (
          <div className="flex flex-col w-full" key={controlItem.name}>
            <label className="mb-2 text-sm font-medium text-gray-700">
              {controlItem.label}
            </label>
            {renderInputByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button
        type="submit"
        className="mt-4 w-full rounded-xl bg-blue-600 text-white font-semibold py-3 hover:bg-blue-700 transition duration-300"
      >
        {buttonText || "submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
