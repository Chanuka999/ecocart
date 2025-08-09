const CommonForm = ({ formControls }) => {
  function renderInputByComponentType(getControllItem) {
    let element = null;
    switch (getControllItem.componentType) {
      case "input":
        element = (
          <input
            name={getControllItem.name}
            placeholder={getControllItem.placeholder}
            id={getControllItem.name}
            type={getControllItem.type}
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
    </form>
  );
};

export default CommonForm;
