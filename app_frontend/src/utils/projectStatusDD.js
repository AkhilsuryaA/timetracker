import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';


const options = ["Open", "In progress", "In review", "Ready to Deploy", "Testing", "Reopen", "Cancel"];
const variance = ["light", "primary", "warning", "success","info","danger", "secondary" ];
class ProjectStatusDD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: options[0],
      variant:variance[0] // default selected value
    };
  }

  handleSelect(eventKey, event) {
    
    this.setState({ selectedOption: options[eventKey], variant:variance[eventKey] });

  }

  render() {
    
      return (
   <div className="select_option">
      <DropdownButton
        title={this.state.selectedOption}
        id="document-type"
        size="sm"
        variant={this.state.variant}
        onSelect={this.handleSelect.bind(this)}
      >
        {options.map((opt, i) => (
          <Dropdown.Item key={i} eventKey={i} >
            {opt}
          </Dropdown.Item>
        ))}
      </DropdownButton>
   </div>  )
  }
}

export default ProjectStatusDD;



