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



%%If this module is to be complied, as apposed to being a yaws file, the server must be restarted when the file
%% is put in the ebin directory so that it is loaded as a 'library'
-module(appcontroller).

%%
%% Include files
%%

%%
%% Exported Functions
%%
-export([dispatch_to_b_rule/3, dispatch_to_view/3, dispatch_to_security/2]).

%%
%% API Functions
%%

%%
%% TODO: Add description of dispatch_to_b_rule/function_arity
%%
dispatch_to_b_rule(_Cmd, _Request, _Map) -> 

    Amapping = dict:fetch(_Cmd, _Map),
    {cmd_mapping,{B_rule_module, B_rule, _, _}} = Amapping,
    %erlang:apply(B_rule_module, B_rule, [_Request]). %do this if there is an unknown number of paramters.
    B_rule_module:B_rule(_Request).

%%
%% TODO: Add description of dispatch_to_view/function_arity
%%
dispatch_to_view(_Cmd, _Data, _Map) -> 
    Amapping = dict:fetch(_Cmd, _Map),
    {cmd_mapping, {_, _, View_control_module, Vcf}} = Amapping,
    View_control_module:Vcf(_Data).


%%
%% TODO: Add description of dispatch_to_view/function_arity
%%
dispatch_to_security(_Request, _Map) ->


    A_default_list = dict:fetch("default", _Map),
    %%
    % If all of the calls to the security functions return true then
    % return true otherwise return false 
    %%
    Passed_default = lists:all(fun(Amapping)->
        {sec_mapping, {Security_control_module, Scf}} = Amapping,
        Security_control_module:Scf(_Request)
                                           end, A_default_list),
    if
    Passed_default =:= true ->% Since the defaults were passed, we know that the command can be found in the request
        {ok,Cmd} = yaws_api:getvar(_Request,"cmd"),
        Command_specific_list = dict:fetch(Cmd, _Map),
        Passed = lists:all(fun(Amapping)->
            {sec_mapping, {Security_control_module, Scf}} = Amapping,
            Security_control_module:Scf(_Request)
                                       end, Command_specific_list);    
    %% The else to the passed default if
    true->Passed = false
    end,
    Passed.

%%
%% Local Functions
%%
