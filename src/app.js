import { SiteTop } from './siteTop'

class InputLabels extends React.Component {
    render() {
        const inputFields = [
            ['URL', 'http://www.example.com/'],
            ['Target', 'Class(es)/ID/Element Name'],
            ['Title', 'Search']
        ];
        const inputLabels = inputFields.map(inputFields =>
            <div className = "row input-fields">
                <label className="badge-dark">{inputFields[0]}</label>
                <input
                    id={inputFields[0].toLowerCase()}
                    placeholder={inputFields[1]}
                    defaultValue={inputFields[1] == 'Search' ? 'Search' : ''}
                    type={inputFields[0] == 'url' ? 'url' : ''}
                />
            </div>
        );
        return <div> {inputLabels} </div>
    }
}

class CalculatorButtons extends React.Component {
    
  toasterNoti(isTrue, displayText) {
      //popup alert unhidden with CSS
      document.getElementById("copyUrl").innerHTML = displayText;
      toaster = document.getElementById("toast");
      // toaster.className = "show";
      if (isTrue == true) {
        toaster.className = "success show"
        setTimeout(function () {
          toaster.className = toast.className.replace("success show", "");
        }, 5000);
      } else {
        toaster.className = "fail show"
        setTimeout(function () {
          toaster.className = toast.className.replace("fail show", "");
        }, 5000);
      }
    }
    
    copyNew() {
      //add output field to clipboard +
      //display toast notification
      copyText = document.getElementById("output");
      copyText.select();
      navigator.clipboard.writeText(copyText.value);
    }
    
    // Removes any surrounding whitespace and Replaces any spaces with commas for use with the wrapper endpoint.
    formatTarget(target) {
      return target.trim().replaceAll(" ", ",");
    }
    
    
    
    displayStorage(idName) {
        //Keeps a record of the console.logs you've made during this session
      //Made it a checkbox so you can 'favorite' the ones you like
      let li = document.createElement("li")
      let copyButton = document.createElement("button")
      let label = document.createElement("label")
      label.innerHTML = localStorage.getItem(idName)
      copyButton.className = 'copyButton calc-button'
      li.id = idName
      
      copyButton.onclick = function(){
        copyDivToClipboard(idName)
        toasterNoti(true,label.innerHTML)
      };
      document.getElementById("list").prepend(li)
      document.getElementById(idName).prepend(label)
      document.getElementById(idName).prepend(copyButton)
    }
    
    copyDivToClipboard(elementId) {
      var range = document.createRange();
      range.selectNode(document.getElementById(elementId));
      console.log(elementId)
      window.getSelection().removeAllRanges(); // clear current selection
      window.getSelection().addRange(range); // to select text
      navigator.clipboard.writeText(elementId.value);
      window.getSelection().removeAllRanges();// to deselect
    }
    
    doMath(choice) {
      //This is the function that adds the query to the URL and the class or ID name. Assigns a value
      //to these vars when any button is clicked
      let urlSelector, elementSelector, totalSelector, h1yn, title, c;
      urlSelector = document.getElementById("url").value; //take the value from the URL field
      elementSelector = formatTarget(document.getElementById("idName").value); //take the value from the class/id/element field
    
      // Might have changed the actual target with formatTarget, so set the idName input to whatever elementSelector is now.
      document.getElementById("idName").value = elementSelector;
      
      if (urlSelector == '') {
        toasterNoti(false, "You should probably enter a URL")
      } else if (isValidHttpUrl(urlSelector) != true) {
        toasterNoti(false, "Your URL doesn't look right... Did you include the protocal?")
      } else {
        if (elementSelector == '') {
          toasterNoti(false, "You're going to need to choose an element")
        } else {
          if (document.getElementById("title").value != '') {
            title = "&title=" + document.getElementById("title").value;
          } else {
            title = '';
          }
    
    
        if (document.getElementById("h1ignoreCheck").checked == 1) {
          h1yn = "&h1Ignore=Y";
        } else {
          h1yn = "&h1Ignore=N";
        };
    
    
        c = choice;
    
        // switch call for selecting ID or Class input
        switch (c) {
          case "class":
            urlSelector = "wrapper-v2?site=" + urlSelector;
            totalSelector = "&target=class&class=" + elementSelector;
            break;
          case "id":
            urlSelector = "wrapper-v2?site=" + urlSelector;
            totalSelector = "&target=id&id=" + elementSelector;
            break;
          case "duda":
            urlSelector = "duda?site=" + urlSelector;
            totalSelector = "&target=id&id=" + elementSelector;
            break;
          case "element":
            urlSelector = "wrapper-v2?site=" + urlSelector;
            totalSelector = "&target=element&el=" + elementSelector;
            break;
          default:
            break;
        }
    
        const outPut = document.getElementById("output")
        
        
        
        //displays wrapper endpoint url
        outPut.value =
          "https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/" +
          urlSelector +
          totalSelector +
          title +
          h1yn;
        copyNew();
    
        let text = document.getElementById("url")
        toasterNoti(true, c.toUpperCase() + ' selected for "' + text.value + '"')
        // Add the data to local storage for react to pull
        localStorage.setItem(storageValue, outPut.value)
    
    
        
        displayStorage(storageValue);
        storageValue++
      }
      }
    }
    
    cleary() {
      //Clears out the page values
      document.getElementById("url").value = "";
      document.getElementById("idName").value = ""; 
      document.getElementById("output").value = ""; 
    }
    
    clearStorage() {
      localStorage.clear();
      let outputtedList = document.getElementById("list")
      outputtedList.innerHTML = '';
      // Get the modal
      var modal = document.getElementById('id01');
      modal.style.display = "none";
      storageValue = 1
    }
    
    // Run on load to grab old endpoints from storage
    loadStorage() {
      for (let i = storageValue - 1; i >= 0; i--){
        displayStorage(localStorage.key(i))
      }
      storageValue = localStorage.length + 1
    }
    
      copyFromStorage(target) {
          copyTarget = document.getElementById(target).innerHTML
          console.log(localStorage.getItem(target))
      }
    
    
      isValidHttpUrl(string) {
          let url;
          
          try {
          url = new URL(string);
          } catch (_) {
          return false;  
          }
      
          return url.protocol === "http:" || url.protocol === "https:";
      }
  render() {
    const storageValue = localStorage.length

        return (
            <div onLoad={this.loadStorage()}>
                <section id="calculator">
                    <div className="app calculator">
                        <h1>Wrapper endpoint creator</h1>
                        <div className="inputs">
                            <div className="row input-fields">
                                <label className="badge-dark">URL</label>
                                <input className="" type="url" name="url" id="url" placeholder="http://example.com" />
                            </div>
                            <div className="input-fields" style="float:right;">
                                <label id="h1label" htmlFor="h1ignoreCheck" className="calc-button ignoreh1 checked">Ignore h1 elements</label>
                                <input type="checkbox" name="h1ignoreCheck" id="h1ignoreCheck" style="height:40px" checked />
                            </div>
                            <div className="row input-fields">
                                <label htmlFor="idName" className="badge-dark">target</label>
                                <input className="" type="text" name="idName" id="idName" placeholder="Class(es)/ID/Element Name" />
                            </div>
                    
                            <div className="row input-fields">
                                <label htmlFor="title" className="badge-dark">Title</label>
                                <input type="text" name="title" id="title" className="col-1" value="Search" />
                            </div>
                    
                            <div className="row calc-buttons">
                                <div className="col">
                                    <button className="calc-button" id="classButton" onClick={this.doMath('class')}>Class(es)</button>
                                    <button className="calc-button" id="idButton" onClick={this.doMath('id')}>ID</button>
                                    <button className="calc-button" id="elementButton" onClick={this.doMath('element')}>Element</button>
                                    <button className="calc-button" id="ClearButton" onClick={this.cleary()}>Clear</button>
                                    <br />
                                    <button className="calc-button" id="DudaButton" onClick={this.doMath('duda')}>Duda ID</button>
                                </div>
                            </div>
                            <div className="row">
                                <div style="position: absolute; font-size: 12px">
                                    <div id="toast" style="display:block">
                                        <h6 style="text-align:left">
                                            Copied to your clipboard
                                        </h6>
                                        <h6 id="copyUrl"></h6>
                                    </div>
                                </div>
                                <label htmlFor="output" className="badge-dark col-4">Output</label>
                                <input className="text-black-50 calculator-result" type="text" value="" name="output" id="output"
                                    onClick={this.copy()}>
                                    
                                </input>
                            </div>
                        </div>
                        <button className="calc-button" onClick="document.getElementById('id01').style.display='block'">Clear
                            storage</button>
                        <div id="id01" className="modal">
                            <span
                                onClick="document.getElementById('id01').style.display='none'"
                                className="close"
                                title="Close Modal">&times;</span>
                            <form className="modal-content" action="/action_page.php">
                                <div className="container">
                                    <h1 style="color:black">Delete Storage</h1>
                                    <p style="color:black">Are you sure you want to delete all that history?</p>
                                    <div className=" clearfix">
                                        <button type="button" id="cancelbtn" className="cancelbtn">Cancel</button>
                                        <button type="button" id="deletebtn" className="deletebtn" onClick={this.clearStorage()}>Delete</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <ol reversed id="list"></ol>
                </section>
                <section>
                    <div id="toast">
                        <h4>
                            Copied to your clipboard
                        </h4>
                        <code id="copyUrl"></code>
                    </div>
                </section>
            </div>
        )
    }
}
class App extends React.Component {
    render() {
        return (
            <div>
                <SiteTop />
                <section id="calculator">
                    <div className="app calculator">
                        <h1>Wrapper Endpoint Creators</h1>
                        <InputLabels />
                        <CalculatorButtons />
                    </div>

                </section>
            </div>            
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)