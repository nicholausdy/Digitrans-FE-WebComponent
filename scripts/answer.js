import { config } from './util/config.js'
import { FetchAPI } from './util/fetchAPI.js'
import { URLParser } from './util/URLParser.js'

import { NavBar } from './components/navbar.js'


class AnswerPage{
  
var myvar = '<!DOCTYPE html>'+
'<html lang="en">'+
''+
'<head>'+
''+
'  <meta http-equiv="content-type" content="text/html; charset=UTF-8">'+
''+
'  <title>Questionnaire</title>'+
''+
'  <script src="script/createQuestionnaire.js"></script>'+
'  <script src="script/getQuestionnaire.js"></script>'+
'  <script src="script/answer.js"></script>'+
''+
''+
'  <link href=\'https://fonts.googleapis.com/css?family=Lato:400,300,400italic,700,900\' rel=\'stylesheet\' type=\'text/css\'>'+
''+
'  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">'+
'  <meta name="description" content="Techie Bootstrap 3 skin">'+
'  <meta name="keywords" content="bootstrap 3, skin, flat">'+
'  <meta name="author" content="bootstraptaste">'+
''+
'  <!-- Bootstrap css -->'+
'  <link href="assets/css/bootstrap.min.css" rel="stylesheet">'+
'  <link href="assets/css/bootstrap.techie.css" rel="stylesheet">'+
''+
'  <link href="assets/css/answer.css" rel="stylesheet">'+
''+
'  <style>'+
'    body,'+
'    html {'+
'      overflow-x: hidden'+
'    }'+
''+
'    body {'+
'      padding: 6px'+
'    }'+
''+
'    footer {'+
'      border-top: 1px solid #ddd;'+
'      padding: 30px;'+
'      margin-top: 50px'+
'    }'+
''+
'    .row>[class*=col-] {'+
'      margin-bottom: 65px'+
'    }'+
''+
'    .col-sm-{'+
'      background: red;'+
'    }'+
''+
'    .navbar-container {'+
'      position: relative;'+
'      min-height: 100px'+
'    }'+
''+
'	.navbar-default {'+
'	 margin : 0 !important; '+
'	}'+
'	</style>'+
'</head>'+
''+
'<body style="background-color:#e6e6ff">'+
''+
'  <div class="container" style="padding:5% 0 5% 21%">'+
''+
'    <div class="row" >'+
'      <!-- Navbar -->'+
'      <div class="col-sm-12 col-lg-12" >'+
'            <nav class="navbar navbar-inverse-modify navbar-fixed-top container" role="navigation" style="background-color:#e6ffff">'+
'              <!-- Brand and toggle get grouped for better mobile display -->'+
'              <div class="container-fluid">'+
'              <div class="navbar-header">'+
'                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex2-collapse">'+
'                    <span class="sr-only">Toggle navigation</span>'+
'                    <span class="icon-bar"></span>'+
'                    <span class="icon-bar"></span>'+
'                    <span class="icon-bar"></span>'+
'                  </button>'+
'                <a class="navbar-brand" href="#"><b>Answer Questionnaire</b></a>'+
'              </div>'+
''+
'              <!-- Collect the nav links, forms, and other content for toggling -->'+
'              <div class="collapse navbar-collapse navbar-ex2-collapse">'+
'                <ul class="nav navbar-nav">	'+
'                    </ul>'+
'                  </li>'+
'                </ul>'+
'              </div>'+
'              <!-- /.navbar-collapse -->'+
'            </nav>'+
''+
'          </div>'+
'    </div>'+
'    <!-- Navs done -->'+
''+
'   <div class="tampilanlogin" style="padding-top:3%;background-color:#f2f2f2;margin-right:20%">'+
'		<table style="margin-bottom:2%" class="tablelogin">'+
'			<tr>'+
'				<td>'+
'          <div class="card">'+
'            <p id="getQuestionnaireTitle" style="font-style:Lato;font-weight:bold;font-size:35px"></p>'+
'          </div>'+
'        </td>'+
'			</tr>'+
'			<tr>'+
'				<td><p id="getQuestionnaireDescription"></p></td>'+
'		</table>'+
'		<!-- Button -->'+
'		</div>'+
'  <div class="row" style="margin-bottom:1%">'+
''+
'  </div>'+
'  <div id="listAnswers" style="background-color:#e5e9f9;margin-right:20%"></div>'+
'  <div class="row">'+
'    <div class="col-sm-6">'+
'      <button type="button" class="btn btn-primary" onclick="answerQuestions()">Submit</button><br><br>'+
'    </div>'+
'    <div class="col-sm-6" style="transform: translate(40%)">'+
'      <a href="landingPageAnswer.html"><button class="btn btn-info">Back</button>'+
'    </div>'+
'  <!-- Main Scripts-->'+
'  <script src="assets/js/jquery.js"></script>'+
'  <script src="assets/js/bootstrap.min.js"></script>'+
''+
'  <!-- Bootstrap 3 has typeahead optionally -->'+
'  <script src="assets/js/typeahead.min.js"></script>'+
'  <script>'+
'    window.onload=loadQuestions();'+
'    window.onload=getQuestionnaireDetails();'+
'  </script>'+
''+
'</body>'+
''+
'</html>';
	


customElements.define('answer-page',AnswerPage);
