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
-module(commandmappings).

%%
%% Include files
%%

%%
%% Exported Functions
%%
-export([create_command_map/0]).
%%
%% Module scoped values
%%


%%
%% API Functions
%%

create_command_map() ->
    Orig_command_map = dict:new(),
    Map1 = utilities:map_command("NoCmd", businessrules, get_default_b_rule, viewcontrolfunctions, generate_defaultVCF, Orig_command_map),
    
    %% Add any mappings you wish to include in the application in this file.
	%% The first mapping must have as input 'firstMap' and the last mapping must be 
	%% bound to 'finalMap'.  The login example below is both a first and a last mapping 
	%% so it shows how both of these should work.
    %%mmandToControl('usrCnt','LocalBusinessRules.inc', 'getUserCountBRule', 'ViewControlFunctions.inc', 'displayUserCountVCF', $USES_ACCESS_OBJECT)
	Map2 = utilities:map_command("userCnt", businessrules, get_user_count_b_rule, viewcontrolfunctions, display_user_countVCF, Map1),
	
    
    utilities:map_command("login", businessrules, login_b_rule, viewcontrolfunctions, login_replyVCF, Map2).   
      
           
           
