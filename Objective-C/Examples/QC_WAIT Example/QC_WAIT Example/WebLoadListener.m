//
//  WebLoadListener.m
//  QC_WAIT Example
//
//  Created by Lee Barney on 9/18/12.
//  Copyright (c) 2012 Lee Barney. All rights reserved.
//

#import "WebLoadListener.h"
#import "QCRequestHandler.h"
#import "QuickConnect.h"

@implementation WebLoadListener

-(WebLoadListener*) initWithRequestHandler:(QCRequestHandler*)aHandler{
    self.theHandler = aHandler;
}
- (void)webViewDidFinishLoad:(UIWebView *)webView{
    NSLog(@"loaded");
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error{
    NSLog(@"failed: %@",error);
}

@end
