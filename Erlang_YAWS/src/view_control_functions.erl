%%
%% Copyright 2007 Lee S. Barney
		
 %% Permission is hereby granted, free of charge, to any person obtaining a 
 %% copy of this software and associated documentation files (the "Software"), 
 %% to deal in the Software without restriction, including without limitation the 
 %% rights to use, copy, modify, merge, publish, distribute, sublicense, 
 %% and/or sell copies of the Software, and to permit persons to whom the Software 
 %% is furnished to do so, subject to the following conditions:
 
 %% The above copyright notice and this permission notice shall be 
 %% included in all copies or substantial portions of the Software.
 
 
 %% THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
 %% INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
 %% PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
 %% HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 %% CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
 %% OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
%%
-module(viewcontrolfunctions).

%%
%% Include files
%%

%%
%% Exported Functions
%%
-export([login_replyVCF/1, generate_defaultVCF/1, display_user_countVCF/1]).


%%
%% API Functions
%%

%%
%% TODO: Add description of login_replyVCF/function_arity
%%
login_replyVCF(_Data) ->
    if
    _Data =/= false -> % if sucessful login, return message and the session cookie header
        Result1 = utilities:add_html_message("<html><body><h1>Successful Login!</h1><a href='quick_connect.yaws?cmd=userCnt'>Get user count</a></body></html>"),
        Result = utilities:add_session_cookie(Result1, _Data);
    %% create a session and add the user id to it
    true -> Result1 = utilities:add_html_message("<html><body><p>Incorrect user name or password</p>"++generate_login_form()++"</body></html>"),
            Result2 = utilities:add_header(Result1,"QC-Error-Number", "-400"),
            Result = utilities:add_header(Result2, "QC-Error-Message", "bad user name or password")
    end,
    Result.

%%
%% TODO: Add description of generate_defaultVCF/function_arity
%%
generate_defaultVCF(_Data) -> 
	utilities:add_html_message("<html><body"++generate_login_form()++"</body></html>").

%%
%% TODO: Add description of display_user_countVCF/function_arity
%%
display_user_countVCF(_Data) ->
    utilities:add_html_message("<html><body><p>There are "++erlang:integer_to_list(_Data)++" users.<p></body></html>").
%%
%% Local Functions
%%

%%
%% In this example the login form is used in more than one VCF so the code to generate it
%% has been pulled out into a local function.  It could be put in a seperate module of 
%% VCF helper functions as the number of VCF's increases to keep this file 'clean'.
%%

generate_login_form() ->
            "<form name='input' action='quick_connect.yaws' method='post'>"++
            "<h1>Welcome to QuickConnectYaws</h1>"++
			"User Name: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type='text' name='uname'><br/>"++
			"User Password: <input type='password' name='pword'><br/>"++
			"<input type='hidden' name='cmd' value='login'>"++"<input type='submit' value='Submit'>"++
			"</form>".
