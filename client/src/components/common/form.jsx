import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const CommonForm = ({ formControls, formData, setFormData, onSubmit }) => {
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
    <form>
      <div className="flex flex-ol gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full" key={controlItem.name}>
            <label className="mb-1">{controlItem.label}</label>
            {renderInputByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-2 w-full">
        {buttonText || "submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
