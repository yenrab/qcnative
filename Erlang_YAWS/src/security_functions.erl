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
-module(securityfunctions).


%%
%% Include files
%%

%%
%% Exported Functions
%%
-export([validate_uname_pword/1, check_command/1,
         check_logged_in/1]).

%%
%% API Functions
%%

%%
%% TODO: Add description of validate_uname_pword/function_arity
%%
validate_uname_pword(_Request) -> 
	%% find out how to use the yaws_api:getvar function from within here
    %{value,{_,Uname}} = lists:keysearch("uname",1,yaws_api:parse_post(_Request)),
    %{value,{_,Pword}} = lists:keysearch("pword",1,yaws_api:parse_post(_Request)),
    {Success_uname, Uname} = yaws_api:getvar(_Request, "uname"),
    {Success_pword, Pword} = yaws_api:getvar(_Request, "uname"),
    if
    	Success_uname == ok andalso Success_pword == ok ->
    		Unamelength = string:len(string:strip(Uname)),
    		Pwordlength = string:len(string:strip(Pword)) > 0,
    		Passed = Unamelength > 0 andalso Pwordlength > 0;
        true->Passed = false
    end,
	Passed.

%%
%% TODO: Add description of check_command/function_arity
%%
check_command(_Request) -> 
    Var = yaws_api:getvar(_Request, "cmd"),
	if
    	Var =/= undefined ->
            {Result,_} = Var,
			if
    			Result == ok -> Found = true;
    			true -> Found = false
    		end;
        true -> Found = false
    end,
    Found.

check_logged_in(_Request) ->
    User_id = utilities:get_session_user_id(_Request),
    if 
    	User_id == false -> Logged_in = false;
        true -> Logged_in = true
    end,
    Logged_in.
                        
                          
%%
%% Local Functions
%%

